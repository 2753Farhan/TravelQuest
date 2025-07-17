import type { LogEntry } from '../types/core'
import apiClient from './client'

export const getLogEntries = async (logId: string, expand?: boolean) => {
  const url = `/log-entries/log/${logId}${expand ? '?expand=all' : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export const getLogEntryById = async (entryId: string, expand?: boolean) => {
  const url = `/log-entries/${entryId}${expand ? '?expand=all' : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export const createLogEntry = async (data: LogEntry) => {
  const response = await apiClient.post('/log-entries', data)
  return response.data
}

export const updateLogEntry = async (entryId: string, data: Partial<LogEntry>) => {
  const response = await apiClient.patch(`/log-entries/${entryId}`, data)
  return response.data
}

export const deleteLogEntry = async (entryId: string) => {
  const response = await apiClient.delete(`/log-entries/${entryId}`)
  return response.data
}