import apiClient from './client'

export const getTravelGroups = async (userId: string) => {
  const response = await apiClient.get(`/travel-groups/user/${userId}`)
  return response.data
}

export const getTravelGroupById = async (groupId: string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}`)
  return response.data
}

export const createTravelGroup = async (data: {
  creatorId: string
  title: string
  startDate?: string
  endDate?: string
  status?: string
}) => {
  const response = await apiClient.post('/travel-groups', data)
  return response.data
}

export const addGroupMember = async (groupId: string, data: {
  userId: string
  role: string
  invitationDetails?: Record<string, any>
}) => {
  const response = await apiClient.post(`/travel-groups/${groupId}/members`, data)
  return response.data
}


export const getGroupMembers = async (groupId: string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}/members`) 
  return response.data
}

export const respondToInvitation = async (membershipId: string, data: {
  userId: string
  action: 'accept' | 'decline'
}) => {
  const response = await apiClient.patch(`/travel-groups/members/${membershipId}/respond`, data)
  return response.data
}

export const addTripItem = async (groupId: string, data: {
  title: string;
  placeId?: string;
  transportId?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  status?: string;
  addedBy: string;
  details?: Record<string, any>;
}) => {
  const response = await apiClient.post(`/travel-groups/${groupId}/items`, data)
  return response.data
}

export const getTripItemByGroupId = async (groupId : string) => {
  const response = await apiClient.get(`/travel-groups/${groupId}/items`)
  return response.data
}


export const voteOnTripItem = async (itemId: string, data: {
  userId: string
  vote: 'up' | 'down'
}) => {
  const response = await apiClient.post(`/travel-groups/items/${itemId}/vote`, data)
  return response.data
}


export const getTripItemById = async (itemId: string) => {
  const response = await apiClient.get(`/travel-groups/items/${itemId}`)
  return response.data
}