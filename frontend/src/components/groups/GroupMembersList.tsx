import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGroupMembers, getTravelGroupById, respondToInvitation } from '../../api/travelgroup'
import { getUserById } from '../../api/user'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import type { InvitationStatus, TripMemberRoles } from '../../types/core'
import { useEffect, useState } from 'react'

interface UserInfo {
  id: string
  username: string
  email?: string
}

interface GroupMember {
  membershipId: string
  tripId: string
  userId: string
  role: TripMemberRoles
  invitationStatus: InvitationStatus
  joinedAt?: string
}

interface GroupMembersListProps {
  groupId: string
  onInviteClick?: () => void
  showInviteButton?: boolean
}

export default function GroupMembersList({
  groupId,
  onInviteClick,
  showInviteButton = true
}: GroupMembersListProps) {
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({})

  const {
    data: members,
    isLoading,
    isError
  } = useQuery<GroupMember[]>({
    queryKey: ['travelGroupMembers', groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId
  })

  useEffect(() => {
    if (!members) return

    const fetchUserInfo = async (userId: string) => {
      if (!userId || userCache[userId]) return

      try {
        const userData = await getUserById(userId)
        setUserCache(prev => ({
          ...prev,
          [userId]: {
            id: userData.id,
            username: userData.username,
            email: userData.email
          }
        }))
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error)
        setUserCache(prev => ({
          ...prev,
          [userId]: {
            id: userId,
            username: 'Unknown User',
            email: undefined
          }
        }))
      }
    }

    members.forEach(member => {
      if (member.userId && !userCache[member.userId]) {
        fetchUserInfo(member.userId)
      }
    })
  }, [members, userCache])

  const respondToInvitationMutation = useMutation<
    void,
    Error,
    { membershipId: string; data: { userId: string; action: 'accept' | 'decline' } }
  >({
    mutationFn: ({ membershipId, data }) => respondToInvitation(membershipId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelGroupMembers', groupId] })
      toast.success('Invitation response recorded')
    },
    onError: (error) => {
      toast.error(`Failed to respond to invitation: ${error.message}`)
    },
  })

  const handleRespondToInvitation = (membershipId: string, action: 'accept' | 'decline') => {
    if (!user?.id) {
      toast.error('User not authenticated')
      return
    }

    respondToInvitationMutation.mutate({
      membershipId,
      data: { userId: user.id, action },
    })
  }

  const getUserDisplay = (userId: string) => {
    if (!userId) return { username: 'Unknown User' }
    return userCache[userId] || { username: 'Loading...' }
  }

  if (authLoading || isLoading) return <LoadingSpinner />
  if (isError) return <div className="text-red-500">Failed to load members</div>
  if (!user) return <div className="text-red-500">Please log in to view group members</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">


      {members?.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No members found
        </div>
      ) : (
        <ul className="space-y-3">
          {members?.map(member => {
            const userInfo = getUserDisplay(member.userId)
            return (
              <li
                key={member.membershipId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{userInfo.username}</span>
                      {member.userId === user.id && (
                        <span className="badge badge-sm">You</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="capitalize">{member.role}</span>
                      {member.invitationStatus === 'pending' && (
                        <span className="badge badge-sm badge-warning">Pending</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {member.role === 'organizer' && (
                    <span className="badge badge-primary badge-sm">Admin</span>
                  )}
                  {member.invitationStatus === 'pending' && member.userId === user.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRespondToInvitation(member.membershipId, 'accept')}
                        className="btn btn-sm btn-primary"
                        disabled={respondToInvitationMutation.isPending}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToInvitation(member.membershipId, 'decline')}
                        className="btn btn-sm btn-secondary"
                        disabled={respondToInvitationMutation.isPending}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}