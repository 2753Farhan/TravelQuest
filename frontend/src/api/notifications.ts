import type { Notification } from '../types/core'
import apiClient from './client'

export const getUserNotifications = async (userId: string, unreadOnly: boolean = false) => {
  const response = await apiClient.get(`/notifications/user/${userId}`, {
    params: { unreadOnly }
  })
  return response.data
}

export const createNotification = async (data: Notification) => {
  const response = await apiClient.post('/notifications', data)
  return response.data
}

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.patch('/notifications/mark-read', { notificationId })
  return response.data
}

export const markAllNotificationsAsRead = async (userId: string) => {
  const response = await apiClient.patch(`/notifications/user/${userId}/mark-all-read`)
  return response.data
}