import type { TransportOption, TransportRoute } from '../types/core'
import apiClient from './client'

export const getTransportOptions = async () => {
  const response = await apiClient.get('/transports/options')
  return response.data
}

export const getTransportById = async (transportId: string) => {
  const response = await apiClient.get(`/transports/options/${transportId}`)
  return response.data
}

export const getTransportRouteByTransportId = async(transportId: string) => {
    const response = await apiClient.get(`/transports/routes/options/${transportId}`)
    return response.data
}



export const getTransportRouteById = async(routeId: String) => {
    const response = await apiClient.get(`/transports/routes/${routeId}`);
    return response.data
}


export const getTransportRoutes = async (startPlaceId?: string, endPlaceId?: string) => {
  let url = '/transports/routes';
  
  if (startPlaceId && endPlaceId) {
    url += `?startId=${startPlaceId}&endId=${endPlaceId}`;
  } else if (startPlaceId || endPlaceId) {
    throw new Error("Both startPlaceId and endPlaceId must be provided when querying specific routes");
  }
  
  const response = await apiClient.get(url);
  return response.data;
}

export const createTransportOption = async (data: TransportOption) => {
  const response = await apiClient.post('/transports/options', data)
  return response.data
}

export const createTransportRoute = async (data: TransportRoute) => {
  const response = await apiClient.post('/transports/routes', data)
  return response.data
}