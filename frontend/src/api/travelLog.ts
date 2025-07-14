import apiClient from './client'
import type { VisibilitySettings } from '../types/core'
import type { TripStatus } from '../types/core'
export const getTravelLogs = async (userId?: string) => {
  if (!userId) {
    console.error('userId is required');
    throw new Error('userId is required');
  }
  const url = `/travel-logs/user/${userId}`;
  const response = await apiClient.get(url)
  return response.data
}

export const getTravelLogById = async (logId: string) => {
  const response = await apiClient.get(`/travel-logs/${logId}`)
  return response.data
}

export const createTravelLog = async (data: {
  title: string
  description: string
  creatorId: string
  startDate?: string
  endDate?: string
  visibility?: VisibilitySettings
  status?: TripStatus
}) => {
  const response = await apiClient.post('/travel-logs', data)
  return response.data
}

export const updateTravelLog = async (logId: string, data: Partial<{
  title: string
  description: string
  start_date?: string
  end_date?: string
  visibility: VisibilitySettings
  status: TripStatus
  creatorId: string
}>) => {

  
  const response = await apiClient.patch(`/travel-logs/${logId}`, data)
  return response.data
}

export const deleteTravelLog = async (logId: string) => {
  const response = await apiClient.delete(`/travel-logs/${logId}`)
  return response.data
}