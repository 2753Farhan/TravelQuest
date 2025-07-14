import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { createTravelGroup } from '../../api/travelgroup'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Plus, Calendar, Users, MapPin, Clock, Globe2, CheckCircle2, XCircle, ArrowLeft, Sparkles } from 'lucide-react'

type FormData = {
  title: string
  description?: string
  destination?: string
  startDate?: string
  endDate?: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
}

export default function CreateGroupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      status: 'planning'
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.id) throw new Error('User not authenticated')
      const group = await createTravelGroup({
        ...data,
        creatorId: user.id
      })
      toast.success('Travel group created successfully!')
      navigate(`/groups/${group.groupId}`)
    } catch (error) {
      toast.error('Failed to create travel group')
      console.error(error)
    }
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Clock className="w-4 h-4" />
      case 'active':
        return <Globe2 className="w-4 h-4" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-6 left-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-6 right-6 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/groups')}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                Create New Group
              </h1>
              <p className="text-xl text-white/90 font-medium mt-2">
                Start planning your next adventure with friends
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Group Details</h2>
                  <p className="text-gray-600">Fill in the information below to create your travel group</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Group Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Users className="w-5 h-5 text-blue-600" />
                    Group Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter an exciting name for your travel group..."
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Describe your travel plans, what makes this trip special..."
                    {...register('description')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label htmlFor="destination" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Destination
                  </label>
                  <input
                    id="destination"
                    type="text"
                    placeholder="Where are you planning to go?"
                    {...register('destination')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      {...register('startDate')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Calendar className="w-5 h-5 text-red-600" />
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      {...register('endDate')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label htmlFor="status" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="planning">🔮 Planning - Just getting started</option>
                    <option value="active">🌟 Active - Ready to go!</option>
                    <option value="completed">✅ Completed - Trip finished</option>
                    <option value="cancelled">❌ Cancelled - Trip cancelled</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate('/groups')}
                    className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Group...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Travel Group
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📝 Choose a memorable name</h4>
                <p>Pick a name that captures the essence of your trip - it'll help everyone get excited!</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📅 Set flexible dates</h4>
                <p>You can always update dates later as your plans become more concrete.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎯 Be specific with destinations</h4>
                <p>Include city names or specific locations to help with planning and coordination.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">👥 Invite friends later</h4>
                <p>After creating the group, you can easily invite friends and start planning together.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}