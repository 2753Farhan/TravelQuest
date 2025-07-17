// src/api/places.ts
import type { Place } from '../types/core'
import apiClient from './client'

export const getPlaces = async (page?: number, limit?: number) => {
  const params: Record<string, any> = {}
  if (page) params.page = page
  if (limit) params.limit = limit

  const response = await apiClient.get('/places', { params })
  return response.data
}

export const getPlaceById = async (placeId: string) => {
  const response = await apiClient.get(`/places/${placeId}`)
  return response.data
}

export const searchPlacesByName = async (name: string) => {
  const response = await apiClient.get(`/places/search?q=${name}`)
  return response.data
}

export const findNearbyPlaces = async (lat: number, lng: number, radius: number = 1000) => {
  const response = await apiClient.get(`/places/nearby?x=${lat}&y=${lng}&radius=${radius}`)
  return response.data
}

export const createPlace = async (data: Place) => {
  const response = await apiClient.post('/places', data)
  return response.data
}

export const deletePlace = async (placeId: string) => {
  const response = await apiClient.delete(`/places/${placeId}`)
  return response.data
} 