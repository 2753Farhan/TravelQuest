import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTravelGroupById, addTripItem, voteOnTripItem, getTripItemByGroupId } from '../../api/travelgroup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../ui/LoadingSpinner';
import apiClient from '../../api/client';
import { useState } from 'react';
import TripItemDetails from './TripItemDetails';
import { getUserById } from '../../api/user';

interface TripItem {
  item_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  place_id?: string;
  transport_id?: string;
  transport_route_id?: string;
  status: string;
  addedBy: string;
  details?: Record<string, any>;
  votes?: { up: number; down: number };
  createdAt?: string;
  addedByUser?: {
    id: string;
    name: string;
  };
}

interface Place {
  place_id: string;
  name: string;
  address?: string;
  description?: string;
}

interface TransportOption {
  transport_id: string;
  transport_type: string;
  provider?: string;
  details?: Record<string, any>;
}

interface TransportRoute {
  route_id: string;
  transport_id: string;
  start_place_id: string;
  end_place_id?: string;
  cost?: number;
  duration?: string;
  details?: Record<string, any>;
}

interface TravelGroup {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  members?: any[];
}

interface TripItemForm {
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  placeId?: string;
  transportId?: string;
  transportRouteId?: string;
  details?: string;
}

const getPlaces = async () => {
  const response = await apiClient.get('/places');
  return response.data.items || response.data;
};

const getTransportOptions = async () => {
  const response = await apiClient.get('/transports/options');
  return response.data.items || response.data;
};

const getTransportRoutes = async (transportId: string) => {
  if (!transportId) return [];
  const response = await apiClient.get(`/transports/routes/options/${transportId}`);
  return response.data.items || response.data;
};

export default function TripItems({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripItemForm>();
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


  const getUserName = async (userId: string) => {
    try {
      const user = await getUserById(userId);
      return user.name || 'Unknown User';
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'Unknown User';
    }
  };

  const { data: group, isLoading: groupLoading, error: groupError } = useQuery<TravelGroup>({
    queryKey: ['travelGroup', groupId],
    queryFn: () => getTravelGroupById(groupId),
    enabled: !!groupId,
  });

  const { 
    data: tripItems, 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery<TripItem[]>({
    queryKey: ['travelGroupItems', groupId],
    queryFn: () => getTripItemByGroupId(groupId),
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });

  const { data: places, isLoading: placesLoading } = useQuery<Place[]>({
    queryKey: ['places'],
    queryFn: getPlaces,
  });

  const { data: transportOptions, isLoading: transportsLoading } = useQuery<TransportOption[]>({
    queryKey: ['transportOptions'],
    queryFn: getTransportOptions,
  });

  const { data: transportRoutes, isLoading: routesLoading } = useQuery<TransportRoute[]>({
    queryKey: ['transportRoutes', selectedTransportId],
    queryFn: () => selectedTransportId ? getTransportRoutes(selectedTransportId) : [],
    enabled: !!selectedTransportId,
  });

  const { data: selectedItem, isLoading: selectedItemLoading } = useQuery({
    queryKey: ['tripItem', selectedItemId],
    queryFn: () => selectedItemId ? apiClient.get(`/travel-groups/items/${selectedItemId}`).then((res: { data: any; }) => res.data) : null,
    enabled: !!selectedItemId,
  });

  const addTripItemMutation = useMutation({
    mutationFn: ({ groupId, data }: { 
      groupId: string; 
      data: {
        title: string;
        placeId?: string;
        transportId?: string;
        transportRouteId?: string;
        startTime?: string;
        endTime?: string;
        date?: string;
        status?: string;
        addedBy: string;
        details?: Record<string, any>;
      }
    }) => addTripItem(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelGroupItems', groupId] });
      reset();
      setSelectedTransportId(null);
      toast.success('Trip item added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add trip item: ${error.message || 'Unknown error'}`);
    },
  });

  const voteTripItemMutation = useMutation({
    mutationFn: ({ itemId, data }: { 
      itemId: string; 
      data: { userId: string; vote: 'up' | 'down' } 
    }) => voteOnTripItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelGroupItems', groupId] });
      toast.success('Vote recorded successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to vote: ${error.message || 'Unknown error'}`);
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    const formattedDate = new Date(formData.date).toISOString().split('T')[0];
    const formattedStartTime = `${formattedDate}T${formData.startTime}:00.000Z`;
    const formattedEndTime = formData.endTime ? `${formattedDate}T${formData.endTime}:00.000Z` : undefined;

    const submissionData = {
      title: formData.title,
      placeId: formData.placeId || undefined,
      transportId: formData.transportRouteId || undefined,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      date: formattedDate,
      status: 'proposed',
      addedBy: user.id,
      details: formData.details ? { text: formData.details } : undefined
    };

    addTripItemMutation.mutate({
      groupId,
      data: submissionData
    });
  });

  const handleVote = (itemId: string, vote: 'up' | 'down') => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }
    voteTripItemMutation.mutate({
      itemId,
      data: { userId: user.id, vote },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(prev => prev === itemId ? null : itemId);
  };

  if (groupLoading || placesLoading || transportsLoading || itemsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (groupError || itemsError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">
            Error loading data: {groupError?.message || itemsError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {group?.title ? `${group.title} - Trip Items` : 'Trip Items'}
        </h1>
        {group?.description && (
          <p className="text-gray-600">{group.description}</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Trip Item</h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="What are you planning?"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-2">
                Place
              </label>
              <select
                id="placeId"
                {...register('placeId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a place (optional)</option>
                {places?.map((place) => (
                  <option key={place.place_id} value={place.place_id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="transportId" className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Type
                </label>
                <select
                  id="transportId"
                  {...register('transportId')}
                  onChange={(e) => setSelectedTransportId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select transport type (optional)</option>
                  {transportOptions?.map((transport) => (
                    <option key={transport.transport_id} value={transport.transport_id}>
                      {transport.transport_type} {transport.provider && `(${transport.provider})`}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedTransportId && (
                <div>
                  <label htmlFor="transportRouteId" className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Route
                  </label>
                  <select
                    id="transportRouteId"
                    {...register('transportRouteId')}
                    disabled={routesLoading || !transportRoutes?.length}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                  >
                    <option value="">Select route (optional)</option>
                    {transportRoutes?.map((route) => {
                      const startPlace = places?.find(p => p.place_id === route.start_place_id);
                      const endPlace = places?.find(p => p.place_id === route.end_place_id);
                      return (
                        <option key={route.route_id} value={route.route_id}>
                          {startPlace?.name || 'Unknown'} to {endPlace?.name || 'Unknown'}
                          {route.cost ? ` ($${route.cost})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                type="time"
                {...register('startTime', { required: 'Start time is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                {...register('endTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
            <textarea
              id="details"
              {...register('details')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Additional details (optional)"
              rows={3}
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={addTripItemMutation.isPending}
            >
              {addTripItemMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Trip Item'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Items</h2>
        
        {tripItems?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No trip items yet</p>
            <p className="text-gray-400 text-sm mt-1">Start planning by adding your first trip item above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tripItems?.map((item) => (
              <div key={item.item_id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => handleItemClick(item.item_id)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{formatDate(item.date)}</span>
                      <span>•</span>
                      <span>
                        {formatTime(item.start_time)}
                        {item.end_time && ` - ${formatTime(item.end_time)}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(item.item_id, 'up');
                      }}
                      className="text-gray-500 hover:text-green-600"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(item.item_id, 'down');
                      }}
                      className="text-gray-500 hover:text-red-600"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                
                {selectedItemId === item.item_id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {selectedItemLoading ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <TripItemDetails tripItemId={item.item_id} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}