import apiClient from './client';
import type { VisibilitySettings } from '../types/core';
import type { PriorityLevels } from '../types/core';

export const getWishlists = async (userId: string) => {
  const response = await apiClient.get(`/wishlists/user/${userId}`);
  return response.data;
};

export const getWishlistById = async (wishlistId: string) => {
  const response = await apiClient.get(`/wishlists/${wishlistId}`);
  return response.data;
};


export const createWishlist = async (data: {
  userId: string;
  title: string;
  visibility: VisibilitySettings;
}) => {
  const response = await apiClient.post('/wishlists', data);
  return response.data;
};


export const updateWishlist = async (wishlistId: string, data: Partial<{
  title: string;
  visibility: VisibilitySettings;
}>) => {
  const response = await apiClient.patch(`/wishlists/${wishlistId}`, data);
  return response.data;
};


export const deleteWishlist = async (wishlistId: string) => {
  const response = await apiClient.delete(`/wishlists/${wishlistId}`);
  return response.data;
};


export const getWishlistItems = async (wishlistId: string) => {
  const response = await apiClient.get(`/wishlists/${wishlistId}/items`);
  return response.data;
};


export const addWishlistItem = async (wishlistId: string, data: {
  placeId?: string;
  priority: PriorityLevels;
  targetSeason?: string;
  notificationRadius?: number;
  isActive?: boolean;
  details?: Record<string, any>;
}) => {
  const response = await apiClient.post(`/wishlists/${wishlistId}/items`, data);
  return response.data;
};

export const updateWishlistItem = async (itemId: string, data: Partial<{
  priority: PriorityLevels;
  targetSeason?: string;
  notificationRadius?: number;
  isActive?: boolean;
  details?: Record<string, any>;
}>) => {
  const response = await apiClient.patch(`/wishlists/items/${itemId}`, data);
  return response.data;
};

export const deleteWishlistItem = async (itemId: string) => {
  const response = await apiClient.delete(`/wishlists/items/${itemId}`);
  return response.data;
};


export const toggleWishlistItemStatus = async (itemId: string) => {
  const response = await apiClient.patch(`/wishlists/items/${itemId}/toggle`);
  return response.data;
};


export const getOverlappingWishlists = async (userId: string, wishlistId?: string) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  try {
    const response = await apiClient.get(`/wishlists/user/${userId}/overlapping`, {
      params: { wishlistId },
    });
    return response.data;
  } catch (error : any) {
    throw new Error(`Failed to fetch overlapping wishlists: ${error.message}`);
  }
};