import { useQuery } from '@tanstack/react-query'
import { getTravelGroupById } from '../../api/travelgroup'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { respondToInvitation } from '../../api/travelgroup'
import toast from 'react-hot-toast'

export default function GroupMembers({ groupId }: { groupId: string }) {
  const { user } = useAuth()
  const { data: group, isLoading, refetch } = useQuery({
    queryKey: ['travelGroupMembers', groupId],
    queryFn: () => getTravelGroupById(groupId),
    enabled: !!groupId
  })

  const handleRespondToInvitation = async (membershipId: string, action: 'accept' | 'decline') => {
    try {
      if (!user?.id) throw new Error('User not authenticated')
      await respondToInvitation(membershipId, {
        userId: user.id,
        action
      })
      toast.success(`Invitation ${action}ed`)
      refetch()
    } catch (error) {
      toast.error(`Failed to ${action} invitation`)
      console.error(error)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Group Members</h2>
      
      <div className="space-y-3">
        {group?.members?.map((member: any) => (
          <div key={member.membershipId} className="flex items-center justify-between p-2 border-b">
            <div>
              <p className="font-medium">{member.user.username}</p>
              <p className="text-sm text-gray-500 capitalize">{member.role}</p>
            </div>
            
            {member.invitationStatus === 'pending' && member.user.id === user?.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRespondToInvitation(member.membershipId, 'accept')}
                  className="btn btn-sm btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespondToInvitation(member.membershipId, 'decline')}
                  className="btn btn-sm btn-secondary"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="btn btn-primary w-full">
          Invite Members
        </button>
      </div>
    </div>
  )
}