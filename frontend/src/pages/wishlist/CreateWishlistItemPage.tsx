import { ArrowLeft, Bell, Calendar, Eye, FileText, MapPin, Plus, Star } from "lucide-react";
import LoadingSpinner from "../../ui/LoadingSpinner";
import toast from "react-hot-toast";
import { addWishlistItem } from "../../api/wishList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PriorityLevels } from "../../types/core";
import { useForm } from "react-hook-form";
import { getPlaces } from "../../api/places";
import { useNavigate, useParams } from "react-router-dom";

;

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

type FormData = {
  placeId?: string;
  priority: PriorityLevels;
  targetSeason?: string;
  notificationRadius?: number;
  isActive?: boolean;
  details?: string;
};

export default function CreateWishlistItemPage() {
  const { wishlistId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: places, isLoading: isLoadingPlaces, error: placesError } = useQuery({
    queryKey: ['places'],
    queryFn: () => getPlaces(),
  });

  const validPlaces = places?.filter(
    (place: Place) => place.place_id && !place.place_id.startsWith('temp-')
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      placeId: '',
      priority: 'medium' as PriorityLevels,
      targetSeason: '',
      notificationRadius: undefined,
      isActive: true,
      details: '',
    },
  });

  const watchedPriority = watch('priority');
  const watchedIsActive = watch('isActive');

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      addWishlistItem(wishlistId!, {
        placeId: data.placeId || undefined,
        priority: data.priority,
        targetSeason: data.targetSeason || undefined,
        notificationRadius: data.notificationRadius,
        isActive: data.isActive,
        details: data.details ? JSON.parse(data.details) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems', wishlistId] });
      toast.success('Wishlist item added successfully!');
      navigate(`/wishlists/${wishlistId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add wishlist item');
    },
  });

  const onSubmit = handleSubmit(async (data: any) => {
    await createMutation.mutateAsync(data);
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/wishlists/${wishlistId}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Wishlist</span>
            </button>
            <div className="flex items-center space-x-2 text-indigo-600">
              <Plus size={20} />
              <span className="font-semibold">Add New Item</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Next Adventure
          </h1>
          <p className="text-gray-600 text-lg">Add a new destination to your wishlist and make it happen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
              <div className="group">
                <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                  <MapPin size={20} className="text-indigo-600" />
                  <span>Destination</span>
                  <span className="text-gray-400 font-normal text-sm">(optional)</span>
                </label>
                
                {isLoadingPlaces && (
                  <div className="flex items-center space-x-2 text-gray-500 p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner className="w-4 h-4" />
                    <span>Loading places...</span>
                  </div>
                )}
                
                {placesError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    Error loading places: {placesError.message}
                  </div>
                )}
                
                {!isLoadingPlaces && validPlaces?.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                    No valid places available. You can still create a wishlist item without selecting a place.
                  </div>
                )}
                
                <select
                  {...register('placeId')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
                  disabled={isLoadingPlaces || !!placesError || !validPlaces || validPlaces.length === 0}
                >
                  <option value="">Choose a destination...</option>
                  {validPlaces?.map((place: Place) => (
                    <option key={place.place_id} value={place.place_id}>
                      {place.name} • {place.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                  <Star size={20} className="text-indigo-600" />
                  <span>Priority Level</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <label key={priority} className="relative cursor-pointer">
                      <input
                        type="radio"
                        value={priority}
                        {...register('priority', { required: 'Priority is required' })}
                        className="sr-only peer"
                      />
                      <div className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-center
                        ${watchedPriority === priority 
                          ? 'border-indigo-500 bg-gradient-to-r ' + getPriorityColor(priority) + ' text-white shadow-lg' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }
                      `}>
                        <div className="text-2xl mb-1">{getPriorityIcon(priority)}</div>
                        <div className="font-medium capitalize">{priority}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.priority.message}</span>
                  </p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                  <Calendar size={20} className="text-indigo-600" />
                  <span>Best Season</span>
                  <span className="text-gray-400 font-normal text-sm">(optional)</span>
                </label>
                <input
                  type="text"
                  {...register('targetSeason')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="e.g., Summer, Spring, Winter..."
                />
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                  <Bell size={20} className="text-indigo-600" />
                  <span>Notification Radius</span>
                  <span className="text-gray-400 font-normal text-sm">(km, optional)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('notificationRadius', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter radius in kilometers"
                />
              </div>

              <div className="group">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <Eye size={20} className="text-indigo-600" />
                  <span className="text-gray-700 font-semibold">Active Status</span>
                  <div className="relative ml-auto">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="sr-only peer"
                    />
                    <div className={`
                      w-12 h-6 rounded-full transition-all duration-200
                      ${watchedIsActive ? 'bg-indigo-600' : 'bg-gray-300'}
                    `}>
                      <div className={`
                        absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200
                        ${watchedIsActive ? 'translate-x-6' : 'translate-x-0'}
                      `} />
                    </div>
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-1 ml-8">
                  {watchedIsActive ? 'This item is active and will trigger notifications' : 'This item is inactive'}
                </p>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                  <FileText size={20} className="text-indigo-600" />
                  <span>Additional Details</span>
                  <span className="text-gray-400 font-normal text-sm">(JSON format, optional)</span>
                </label>
                <textarea
                  {...register('details', {
                    validate: (value: string | undefined) => {
                      if (!value) return true;
                      try {
                        JSON.parse(value);
                        return true;
                      } catch {
                        return 'Must be valid JSON format';
                      }
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400 font-mono text-sm min-h-[120px] resize-none"
                  placeholder='{"notes": "Check out the local markets", "budget": 1500, "companions": ["Alice", "Bob"]}'
                />
                {errors.details && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.details.message}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/wishlists/${wishlistId}`)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                  className={`
                    px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg
                    ${isSubmitting || createMutation.isPending
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-[1.02]'
                    }
                  `}
                >
                  {isSubmitting || createMutation.isPending ? (
                    <span className="flex items-center space-x-2">
                      <LoadingSpinner className="w-4 h-4" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Plus size={18} />
                      <span>Add to Wishlist</span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 sticky top-24">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Tips</h3>
                <p className="text-gray-600 text-sm">Make your wishlist item stand out</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                    <MapPin size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Choose Your Destination</h4>
                    <p className="text-sm text-gray-600">Select from available places or leave empty for flexible planning</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <Star size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Set Priority</h4>
                    <p className="text-sm text-gray-600">High priority items get better visibility and notifications</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Best Season</h4>
                    <p className="text-sm text-gray-600">Plan ahead by noting the ideal time to visit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <Bell size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Notifications</h4>
                    <p className="text-sm text-gray-600">Get alerted when you're nearby your dream destination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}