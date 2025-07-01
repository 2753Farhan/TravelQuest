import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../api/client';
import type { User } from '../types/user';
import axios from 'axios';

export function useAuth() {
  const navigate = useNavigate(); // Correctly placed at the top level
  
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      try {
        const response = await apiClient.get('/users/me');
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (!isLoading) {
      setAuthState({
        isAuthenticated: !!data,
        user: data || null,
        isLoading: false
      });
    }
  }, [data, isLoading]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      const userData = await refetch();
      
      setAuthState({
        isAuthenticated: true,
        user: userData.data || response.data.user,
        isLoading: false
      });
      
      return userData.data || response.data.user;
    } catch (error) {
      console.error(error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      navigate('/auth/login', { replace: true });
    }
  };

  return {
    ...authState,
    isError,
    login,
    logout,
    refetch
  };
}