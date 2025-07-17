import apiClient from './client'
import type { ChatMessage } from '../types/core';

export const getGroupChats = async (groupId: string) => {
  const response = await apiClient.get(`/chats/group/${groupId}`)
  return response.data
}

export const getChatThreads = async (parentId: string) => {
  const response = await apiClient.get(`/chats/thread/${parentId}`)
  return response.data
}

export const createChat = async (data: ChatMessage) => {
  const response = await apiClient.post('/chats', data)
  return response.data
}