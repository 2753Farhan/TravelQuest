import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { deleteWishlistItem, toggleWishlistItemStatus } from '../../api/wishList';
import { getPlaces } from '../../api/places';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { 
  MapPin, 
  Edit3, 
  Trash2, 
  Power, 
  PowerOff, 
  Star, 
  Calendar, 
  Navigation,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Globe,
  Mountain,
  Utensils,
  Hotel,
  ShoppingBag,
  Landmark,
  Trees,
  Plane
} from 'lucide-react';
import type { PriorityLevels } from '../../types/core';
import { Button, Popover } from '@headlessui/react';

interface Place {
  place_id: string;
  name: string;
  type: string;
  coordinates: { x: number; y: number };
  address?: string;
  details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface WishlistItem {
  itemId: string;
  wishlistId: string;
  placeId?: string;
  priority: PriorityLevels;
  targetSeason?: string;
  notificationRadius?: number;
  isActive?: boolean;
  details?: Record<string, any>;
}

interface Props {
  item: WishlistItem;
  className?: string;
}

export default function WishlistItemCard({ item, className = '' }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: places, isLoading: isLoadingPlaces, error: placesError } = useQuery({
    queryKey: ['places'],
    queryFn: () => getPlaces(),
  });

  const validPlaces = places?.filter(
    (place: Place) => place.place_id && !place.place_id.startsWith('temp-')
  );

  const place = item.placeId
    ? validPlaces?.find((p: Place) => p.place_id === item.placeId)
    : undefined;

  const deleteMutation = useMutation({
    mutationFn: () => deleteWishlistItem(item.itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems', item.wishlistId] });
      toast.success('Wishlist item deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete wishlist item');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: () => toggleWishlistItemStatus(item.itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems', item.wishlistId] });
      toast.success(`Wishlist item ${item.isActive ? 'deactivated' : 'activated'} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to toggle wishlist item status');
    },
  });

  const getPriorityColor = (priority: PriorityLevels) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: PriorityLevels) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getPlaceTypeIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('restaurant') || typeLower.includes('cafe') || typeLower.includes('food')) {
      return <Utensils className="w-5 h-5 text-amber-600" />;
    } else if (typeLower.includes('mountain') || typeLower.includes('hike')) {
      return <Mountain className="w-5 h-5 text-emerald-600" />;
    } else if (typeLower.includes('hotel') || typeLower.includes('accommodation')) {
      return <Hotel className="w-5 h-5 text-blue-600" />;
    } else if (typeLower.includes('shop') || typeLower.includes('mall')) {
      return <ShoppingBag className="w-5 h-5 text-purple-600" />;
    } else if (typeLower.includes('landmark') || typeLower.includes('monument')) {
      return <Landmark className="w-5 h-5 text-amber-800" />;
    } else if (typeLower.includes('park') || typeLower.includes('garden')) {
      return <Trees className="w-5 h-5 text-green-600" />;
    } else if (typeLower.includes('airport')) {
      return <Plane className="w-5 h-5 text-sky-600" />;
    } else {
      return <MapPin className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleViewOnMap = () => {
    if (place?.coordinates) {
      navigate(`/map?lat=${place.coordinates.y}&lng=${place.coordinates.x}&placeId=${place.place_id}`);
    }
  };

  return (
    <div className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden ${className}`}>
      {/* Header with place info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow">
              {isLoadingPlaces ? (
                <LoadingSpinner className="w-5 h-5 text-gray-400" />
              ) : placesError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : place ? (
                getPlaceTypeIcon(place.type)
              ) : (
                <MapPin className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {isLoadingPlaces ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner className="w-4 h-4" />
                      Loading place...
                    </span>
                  ) : placesError ? (
                    <span className="text-red-600">Error loading place</span>
                  ) : place ? (
                    place.name
                  ) : item.placeId ? (
                    <span className="text-amber-600">Place not found</span>
                  ) : (
                    'Custom Item'
                  )}
                </h3>
                
                {/* Status Badge */}
                <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  item.isActive 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.isActive ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">{item.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              
              {place && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    {place.type}
                  </p>
                  
                  {place.address && (
                    <Popover>
                      <Popover.Button as="button" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>View address</span>
                      </Popover.Button>
                      <Popover.Panel className="w-64 p-2 text-sm bg-white rounded shadow border mt-2 z-50">
                        {place.address}
                      </Popover.Panel>
                    </Popover>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Priority */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Priority</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
            {getPriorityIcon(item.priority)}
            <span className="capitalize">{item.priority}</span>
          </div>
        </div>

        {/* Target Season */}
        {item.targetSeason && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Target Season</span>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-amber-600" />
              {item.targetSeason}
            </div>
          </div>
        )}

        {/* Notification Radius */}
        {item.notificationRadius !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Notification Radius</span>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Navigation className="w-4 h-4 text-blue-600" />
              {item.notificationRadius * 1000}m
            </div>
          </div>
        )}

        {/* Details */}
        {item.details && Object.keys(item.details).length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MoreHorizontal className="w-4 h-4" />
              Additional Details
            </h4>
            <div className="text-xs text-gray-600 bg-white p-2 rounded border font-mono max-h-32 overflow-y-auto">
              {JSON.stringify(item.details, null, 2)}
            </div>
          </div>
        )}

        {/* Map button for places with coordinates */}
        {/* {place?.coordinates && (
          <Button
            className="w-full mt-2 flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm py-2 rounded-lg"
            onClick={handleViewOnMap}
          >
            <MapPin className="w-4 h-4" />
            View on Map
          </Button>
        )} */}
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-2">
          {/* <Link
            to={`/wishlists/${item.wishlistId}/items/${item.itemId}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-100"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link> */}
          
          {/* <button
            onClick={() => toggleMutation.mutate()}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border ${
              item.isActive
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100'
                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
            }`}
            disabled={toggleMutation.isPending}
          >
            {toggleMutation.isPending ? (
              <LoadingSpinner className="w-4 h-4" />
            ) : item.isActive ? (
              <PowerOff className="w-4 h-4" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {toggleMutation.isPending ? 'Loading...' : item.isActive ? 'Deactivate' : 'Activate'}
            </span>
          </button> */}
          
          <button
            onClick={() => deleteMutation.mutate()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-100"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <LoadingSpinner className="w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}