import apiClient from './client'

export const getGroupChats = async (groupId: string) => {
  const response = await apiClient.get(`/chats/group/${groupId}`)
  return response.data
}

export const getChatThreads = async (parentId: string) => {
  const response = await apiClient.get(`/chats/thread/${parentId}`)
  return response.data
}

export const createChat = async (data: {
  type: string
  parent_id?: string
  group_id?: string
  user_id?: string
  title?: string
  content?: string
  details?: Record<string, any>
}) => {
  const response = await apiClient.post('/chats', data)
  return response.data
}