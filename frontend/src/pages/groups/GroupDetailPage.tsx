import { useQuery } from '@tanstack/react-query'
import {  useParams } from 'react-router-dom'
import { getTravelGroupById } from '../../api/travelgroup'
import LoadingSpinner from '../../ui/LoadingSpinner'
import TripItems from '../../components/groups/TripItems'
import GroupChat from '../../components/groups/GroupChat'
import { CalendarDays, Users, MapPin,Settings, Globe2, Clock, MessageCircle } from 'lucide-react'
import { getGroupMembers } from '../../api/travelgroup'
import GroupMembersList from '../../components/groups/GroupMembersList'
export default function GroupDetailPage() {
  const { groupId } = useParams()

const { data: group, isLoading } = useQuery({
  queryKey: ['travelGroup', groupId],
  queryFn: () => getTravelGroupById(groupId || ''),
  enabled: !!groupId
});

const { data: membersCount } = useQuery({
  queryKey: ['getGroupMembers', groupId],
  queryFn: () => getGroupMembers(groupId || ''),
  enabled: !!groupId
});



  if (isLoading) return <LoadingSpinner fullPage />

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
      case 'planning':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Globe2 className="w-3 h-3" />
      case 'planning':
        return <Clock className="w-3 h-3" />
      case 'completed':
        return <CalendarDays className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r  from-[#0f0b8c] to-[#77dcf5]"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                  {group?.title}
                </h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getStatusColor(group?.status)}`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(group?.status)}
                    {group?.status}
                  </div>
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 text-white/90">
                {(group?.startDate || group?.endDate) && (
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <CalendarDays className="w-5 h-5" />
                    <span className="font-medium">
                      {group?.startDate && new Date(group.startDate).toLocaleDateString()}
                      {group?.endDate && ` - ${new Date(group.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                
                {group?.destination && (
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{group.destination}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{membersCount?.length || 0} members</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">

              

            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  Trip Itinerary
                </h2>
                <p className="text-gray-600 mt-2">Plan and track your adventure</p>
              </div>
              <div className="p-8">
                <TripItems groupId={groupId || ''} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    Members
                  </h2>
                  <p className="text-gray-600 mt-1">Travel companions</p>
                </div>
                <div className="p-6">
                  <GroupMembersList groupId={groupId || ''} />
                </div>

              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    Group Chat
                  </h2>
                  <p className="text-gray-600 mt-1">Stay connected</p>
                </div>
                <div className="p-6">
                  <GroupChat groupId={groupId || ''} />
                </div>
              </div>
              
              {group?.description && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    About This Trip
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{group.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}