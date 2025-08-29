import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGroupChats, createChat } from '../../api/chats'
import { getUserById } from '../../api/user'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import type { ChatMessage } from '../../types/core'

interface UserInfo {
  id: string
  username: string
  email?: string
}

interface GroupChatProps {
  groupId: string
}

export default function GroupChat({ groupId }: GroupChatProps) {
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const [replyMessage, setReplyMessage] = useState<{ [key: string]: string }>({})
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set())
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({})

  const {
    data: messages,
    isLoading,
    isError
  } = useQuery<ChatMessage[]>({
    queryKey: ['groupChats', groupId],
    queryFn: () => getGroupChats(groupId),
    enabled: !!groupId
  })

  useEffect(() => {
    if (!messages) return

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

    messages.forEach(message => {
      if (message.userId && !userCache[message.userId]) {
        fetchUserInfo(message.userId)
      }
      
      message.details?.replies?.forEach((reply: ChatMessage) => {
        if (reply.userId && !userCache[reply.userId]) {
          fetchUserInfo(reply.userId)
        }
      })
    })
  }, [messages, userCache])

  const createChatMutation = useMutation<
    ChatMessage,
    Error,
    { data: { type: string; groupId: string; content: string; parentId?: string, userId?: string } }
  >({
    mutationFn: ({ data }) => createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupChats', groupId] })
      setNewMessage('')
      setReplyMessage({})
      toast.success('Message sent')
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`)
    },
  })

  const handleSendMessage = (parentId?: string, messageContent: string = newMessage) => {
    if (!user?.id) {
      toast.error('Please log in to send messages')
      return
    }
    if (!messageContent.trim()) {
      toast.error('Message cannot be empty')
      return
    }

    createChatMutation.mutate({
      data: {
        type: 'group',
        groupId,
        content: messageContent,
        ...(parentId && { parentId }),
        userId: user.id,
      },
    })
  }

  const toggleThread = (messageId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  const getUserDisplay = (userId: string) => {
    if (!userId) return { username: 'Unknown User' }
    return userCache[userId] || { username: 'Loading...' }
  }

  if (authLoading || isLoading) return <LoadingSpinner />
  if (isError) return <div className="text-red-500">Failed to load chats</div>
  if (!user) return <div className="text-red-500">Please log in to view group chats</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">

      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {messages?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No messages yet
          </div>
        ) : (
          messages?.map(message => {
            const sender = getUserDisplay(message.userId ?? '')
            return (
              <div key={message.chatId} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{sender.username}</span>
                      {message.userId === user.id && (
                        <span className="badge badge-sm">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleThread(message.chatId)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  {expandedThreads.has(message.chatId) ? 'Hide Replies' : 'Show Replies'}
                </button>
                {expandedThreads.has(message.chatId) && (
                  <div className="ml-6 mt-2 space-y-2">
                    {message.details?.replies?.map((reply: ChatMessage) => {
                      const replySender = getUserDisplay(reply.userId ?? '')
                      return (
                        <div key={reply.chatId} className="p-2 bg-gray-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{replySender.username}</span>
                            {reply.userId === user.id && (
                              <span className="badge badge-sm">You</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{reply.content}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )
                    })}
                    <div className="flex space-x-2 mt-2">
                      <input
                        type="text"
                        value={replyMessage[message.chatId] || ''}
                        onChange={(e) => setReplyMessage({ ...replyMessage, [message.chatId]: e.target.value })}
                        placeholder="Type a reply..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-sm"
                      />
                      <button
                        onClick={() => handleSendMessage(message.chatId, replyMessage[message.chatId])}
                        className="btn btn-sm btn-primary"
                        disabled={createChatMutation.isPending}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
        />
        <button
          onClick={() => handleSendMessage()}
          className="btn btn-primary"
          disabled={createChatMutation.isPending}
        >
          Send
        </button>
      </div>
    </div>
  )
}