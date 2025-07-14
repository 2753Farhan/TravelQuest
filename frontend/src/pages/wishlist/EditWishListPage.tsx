import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlistById, updateWishlist, deleteWishlist } from '../../api/wishList';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import type { VisibilitySettings } from '../../types/core';

type FormData = {
  title: string;
  visibility: VisibilitySettings;
};

export default function EditWishlistPage() {
  const { wishlistId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading: isWishlistLoading, error: wishlistError } = useQuery({
    queryKey: ['wishlist', wishlistId],
    queryFn: () => getWishlistById(wishlistId!),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      visibility: 'private' as VisibilitySettings,
    },
  });

  if (wishlist && !isWishlistLoading && !wishlistError) {
    reset({
      title: wishlist.title,
      visibility: wishlist.visibility,
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateWishlist(wishlistId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', wishlistId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Wishlist updated successfully!');
      navigate(`/wishlists/${wishlistId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update wishlist');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWishlist(wishlistId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Wishlist deleted successfully!');
      navigate('/wishlists');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete wishlist');
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await updateMutation.mutateAsync(data);
  });

  if (isWishlistLoading) return <LoadingSpinner fullPage />;
  if (wishlistError)
    return <div className="text-red-600 text-center py-8">Error: {wishlistError.message}</div>;
  if (!wishlist) return <div className="text-red-600 text-center py-8">Wishlist not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Wishlist</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="visibility" className="block mb-1 font-medium">
            Visibility
          </label>
          <select
            id="visibility"
            {...register('visibility', { required: 'Visibility is required' })}
            className="input w-full"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="shared">Shared</option>
          </select>
          {errors.visibility && (
            <p className="text-red-500 text-sm mt-1">{errors.visibility.message}</p>
          )}
        </div>

        <div className="flex justify-between space-x-3 pt-4">
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            className="btn btn-danger"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <span className="flex items-center">
                <LoadingSpinner className="mr-2" />
                Deleting...
              </span>
            ) : (
              'Delete Wishlist'
            )}
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/wishlists/${wishlistId}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || updateMutation.isPending}
            >
              {isSubmitting || updateMutation.isPending ? (
                <span className="flex items-center">
                  <LoadingSpinner className="mr-2" />
                  Updating...
                </span>
              ) : (
                'Update Wishlist'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}