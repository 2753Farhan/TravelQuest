import { useQuery, useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getTravelGroups, getGroupMembers } from '../../api/travelgroup'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { Plus, Users, Calendar, MapPin, Globe2, Clock, CheckCircle2, RefreshCw, Plane } from 'lucide-react'


type GroupMember = {
  id: string
  userId: string
  groupId: string
  role: string
  
}

type TravelGroup = {
  groupId: string
  title: string
  destination?: string
  startDate?: string
  endDate?: string
  status: string
  
}

export default function GroupsPage() {
  const { user } = useAuth()
  
  const {
    data: groups,
    isLoading,
    isError,
    refetch
  } = useQuery<TravelGroup[]>({
    queryKey: ['travelGroups', user?.id],
    queryFn: () => getTravelGroups(user?.id || ''),
    enabled: !!user?.id
  })

  
  const groupMembersQueries = useQueries({
    queries: groups?.map(group => ({
      queryKey: ['groupMembers', group.groupId],
      queryFn: () => getGroupMembers(group.groupId),
      enabled: !!group.groupId
    })) || []
  })

  
  const groupsWithMembers = groups?.map((group, index) => ({
    ...group,
    memberCount: groupMembersQueries[index]?.data?.length || 0
  }))

  if (isLoading) return <LoadingSpinner fullPage />
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-red-600 mb-6">Failed to load your travel groups</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
      case 'planning':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
      case 'completed':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Globe2 className="w-4 h-4" />
      case 'planning':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative bg-gradient-to-r  from-[#0f0b8c] to-[#77dcf5]">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                  My Travel Groups
                </h1>
              </div>
              <p className="text-xl text-white/90 font-medium">
                Discover amazing destinations with your favorite people
              </p>
            </div>

            <div className="flex gap-4">
              <Link 
                to="/groups/new" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
              >
                <Plus className="w-6 h-6" />
                Create New Group
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {groupsWithMembers?.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Adventure</h2>
              <p className="text-gray-600 mb-8 text-lg">
                You haven't joined any travel groups yet. Create your first group and start planning amazing adventures with friends!
              </p>
              <Link 
                to="/groups/new" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
              >
                <Plus className="w-6 h-6" />
                Create Your First Group
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupsWithMembers?.map((group) => (
              <Link
                key={group.groupId}
                to={`/groups/${group.groupId}`}
                className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative bg-gradient-to-r from-[#a0d1ff] to-[#0d6abf] p-6 text-white">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-bold line-clamp-2 flex-1 pr-2">
                        {group.title}
                      </h2>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(group.status)} shadow-lg`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(group.status)}
                          <span className="capitalize">{group.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {group.destination && (
                      <div className="flex items-center gap-2 text-white/90 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{group.destination}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {(group.startDate || group.endDate) && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Trip Dates</p>
                          <p className="text-sm">
                            {group.startDate && new Date(group.startDate).toLocaleDateString()}
                            {group.endDate && ` - ${new Date(group.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Members</p>
                        <p className="text-sm">{group.memberCount} travelers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">View Details</span>
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}