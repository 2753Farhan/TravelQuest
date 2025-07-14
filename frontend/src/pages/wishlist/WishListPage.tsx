import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getWishlists } from '../../api/wishList'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { Heart, Plus, Calendar, Eye, EyeOff, Gift } from 'lucide-react'
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

export default function WishlistsPage() {
  const { user } = useAuth()
  const { data: wishlists, isLoading } = useQuery({
    queryKey: ['wishlists'],
    queryFn: () => getWishlists(user?.id!),
    enabled: !!user?.id,
  })

  if (isLoading) return <LoadingSpinner fullPage />

  const getVisibilityIcon = (visibility: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined) => {
    return visibility === 'private' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
  }

  const getVisibilityColor = (visibility: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | null | undefined> | null | undefined) => {
    return visibility === 'private' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              My Wishlists
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Keep track of all the things you love and want
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link 
            to="/wishlists/new" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create New Wishlist
          </Link>
        </div>

        {wishlists?.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No wishlists yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start creating your first wishlist to organize all the things you love!
              </p>
              <Link 
                to="/wishlists/new" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Your First Wishlist
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlists?.map((wishlist: { wishlistId: Key | null | undefined; visibility: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date }) => (
              <Link
                key={wishlist.wishlistId}
                to={`/wishlists/${wishlist.wishlistId}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(wishlist.visibility)}`}>
                      {getVisibilityIcon(wishlist.visibility)}
                      <span className="capitalize">{wishlist.visibility}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {wishlist.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(wishlist.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-200 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        )}

        {wishlists && wishlists.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <Heart className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">
                {wishlists.length} wishlist{wishlists.length !== 1 ? 's' : ''} created
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}