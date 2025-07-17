import type { AddMemberData, RespondToInvitationData, TravelGroup, TripItem, VoteOnTripItemData } from '../types/core'
import apiClient from './client'

export const getTravelGroups = async (userId: string) => {
  const response = await apiClient.get(`/travel-groups/user/${userId}`)
  return response.data
}

export const getTravelGroupById = async (groupId: string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}`)
  return response.data
}

export const createTravelGroup = async (data: TravelGroup) => {
  const response = await apiClient.post('/travel-groups', data)
  return response.data
}

export const addGroupMember = async (groupId: string, data: AddMemberData
) => {
  const response = await apiClient.post(`/travel-groups/${groupId}/members`, data)
  return response.data
}


export const getGroupMembers = async (groupId: string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}/members`) 
  return response.data
}

export const respondToInvitation = async (membershipId: string, data: RespondToInvitationData) => {
  const response = await apiClient.patch(`/travel-groups/members/${membershipId}/respond`, data)
  return response.data
}

export const addTripItem = async (groupId: string, data: TripItem) => {
  const response = await apiClient.post(`/travel-groups/${groupId}/items`, data)
  return response.data
}

export const getTripItemByGroupId = async (groupId : string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}/items`)
  return response.data
}


export const voteOnTripItem = async (itemId: string, data: VoteOnTripItemData) => {
  const response = await apiClient.post(`/travel-groups/items/${itemId}/vote`, data)
  return response.data
}


export const getTripItemById = async (itemId: string) => {
  const response = await apiClient.get(`/travel-groups/items/${itemId}`)
  return response.data
}