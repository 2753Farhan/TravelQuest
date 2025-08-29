import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getTravelLogById, updateTravelLog } from '../../api/travelLog'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { MapPin, Calendar, Eye, Save, ArrowLeft, Globe, Lock, Users, Loader2 } from 'lucide-react'

type FormData = {
  title: string
  description: string
  startDate?: string
  endDate?: string
  visibility: 'public' | 'private' | 'friends_only'
  status: 'planning' | 'active' | 'completed' | 'cancelled'
}

export default function EditTravelLogPage() {
  const { logId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormData>()

  const watchedValues = watch()

  useEffect(() => {
  const fetchTravelLog = async () => {
    try {
      
      if (!logId) {
        navigate('/travel-logs')
        return
      }

      if (!user) {
        return 
      }

      const log = await getTravelLogById(logId)
      
      if (!log) {
        toast.error('Travel log not found')
        navigate('/travel-logs')
        return
      }


      
      if (log.creatorId !== user.id) {
        toast.error('You can only edit your own travel logs')
        navigate('/travel-logs')
        return
      }

      const formattedLog = {
        ...log,
        startDate: log.start_date ? log.start_date.split('T')[0] : '',
        endDate: log.end_date ? log.end_date.split('T')[0] : ''
      }
      
      reset(formattedLog)
    } catch (error) {
      toast.error('Failed to load travel log')
      console.error(error)
      navigate('/travel-logs')
    }
  }

  fetchTravelLog()
}, [logId, user, reset, navigate]) 
const onSubmit = handleSubmit(async (data) => {
  try {
    if (!user || !logId) throw new Error('Invalid request');
    
    
    const payload = {
      title: data.title,
      description: data.description,
      start_date: data.startDate,  
      end_date: data.endDate,      
      visibility: data.visibility,
      status: data.status,
      creator_id: user.id           
    };

    await updateTravelLog(logId, payload);
    
    toast.success('Travel log updated successfully!');
    navigate(`/travel-logs`);
  } catch (error) {
    toast.error('Failed to update travel log');
    console.error(error);
  }
});

  const statusColors = {
    planning: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  }

  const visibilityIcons = {
    public: <Globe size={14} className="text-blue-600" />,
    private: <Lock size={14} className="text-gray-600" />,
    friends_only: <Users size={14} className="text-yellow-600" />
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] opacity-40"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/travel-logs`)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Travel Logs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Save size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Edit Travel Log</h1>
                    <p className="text-indigo-100 mt-1">Update your adventure details</p>
                  </div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-8">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <MapPin size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                        <p className="text-sm text-gray-500">Update your travel log name and description</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="My Amazing Journey to..."
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.title.message}
                      </p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[100px] bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Tell us about your travel plans, experiences, and memories..."
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Calendar size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Travel Dates</h2>
                        <p className="text-sm text-gray-500">Update your travel dates</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          id="startDate"
                          type="date"
                          {...register('startDate')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="endDate" className="block mb-2 font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          id="endDate"
                          type="date"
                          {...register('endDate')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <Eye size={18} className="text-cyan-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Privacy & Status</h2>
                        <p className="text-sm text-gray-500">Update visibility and status</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="visibility" className="block mb-2 font-medium text-gray-700">
                          Visibility
                        </label>
                        <select 
                          id="visibility" 
                          {...register('visibility')} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="public">🌍 Public</option>
                          <option value="private">🔒 Private</option>
                          <option value="friends_only">👥 Friends Only</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
                          Status
                        </label>
                        <select 
                          id="status" 
                          {...register('status')} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="planning">📋 Planning</option>
                          <option value="active">🚀 Active</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 mt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(`/travel-logs/${logId}`)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Update Log
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye size={16} className="text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex-1">
                      {watchedValues.title || 'Your Travel Log Title'}
                    </h4>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[watchedValues.status]}`}>
                        {watchedValues.status}
                      </span>
                      {visibilityIcons[watchedValues.visibility]}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {watchedValues.description || 'Your travel description will appear here...'}
                  </p>
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    {watchedValues.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>From: {new Date(watchedValues.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {watchedValues.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>To: {new Date(watchedValues.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}