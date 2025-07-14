import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWishlist } from '../../api/wishList';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Heart, Plus, Eye, EyeOff, Users, ArrowLeft } from 'lucide-react';
import type { VisibilitySettings } from '../../types/core';

type FormData = {
  title: string;
  visibility: VisibilitySettings;
};

export default function CreateWishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      visibility: 'private' as VisibilitySettings,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      createWishlist({
        userId: user?.id!,
        title: data.title,
        visibility: data.visibility,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Wishlist created successfully!');
      navigate('/wishlists');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create wishlist');
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync(data);
  });

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Required</h2>
          <p className="text-red-600">Please log in to create a wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create New Wishlist
            </h1>
          </div>
          <p className="text-gray-600">
            Start organizing your dreams and desires
          </p>
        </div>

        <button
          onClick={() => navigate('/wishlists')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wishlists
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Wishlist Details</h2>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Wishlist Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a name for your wishlist..."
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xs">!</span>
                  </div>
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-semibold text-gray-700 mb-2">
                Who can see this wishlist?
              </label>
              <div className="relative">
                <select
                  id="visibility"
                  {...register('visibility', { required: 'Visibility is required' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none bg-white"
                >
                  <option value="private">🔒 Private - Only you can see it</option>
                  <option value="public">🌍 Public - Anyone can see it</option>
                  <option value="shared">👥 Shared - Share with specific people</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.visibility && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xs">!</span>
                  </div>
                  <p className="text-red-500 text-sm">{errors.visibility.message}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs">ℹ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm mb-1">Privacy Settings</h3>
                  <p className="text-blue-700 text-sm">
                    You can always change the visibility settings later. Private wishlists are only visible to you, 
                    while public ones can be discovered by anyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/wishlists')}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting || createMutation.isPending}
              >
                {isSubmitting || createMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner className="w-4 h-4" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Wishlist
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
            <Heart className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 text-sm">
              Tip: Give your wishlist a descriptive name to easily find it later
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}