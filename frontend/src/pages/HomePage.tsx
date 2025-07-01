import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function HomePage() {
   const { user, logout } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Cefalo Travel Connect</h1>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Hello, <span className="font-semibold text-primary-600">{user.username}</span>! 
                Ready to plan your next adventure?
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link 
                  to="/travel-logs" 
                  className="btn btn-primary flex-1 min-w-[200px]"
                >
                  View Travel Logs
                </Link>
                <Link 
                  to="/wishlists" 
                  className="btn btn-secondary flex-1 min-w-[200px]"
                >
                  My Wishlists
                </Link>
                <button
                  onClick={logout}
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1 min-w-[200px]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : ( 
            <div className="space-y-4">
              <p className="text-lg">
                Share your travel experiences, plan trips with colleagues, and discover new destinations.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link 
                  to="/auth/login" 
                  className="btn btn-primary flex-1 min-w-[200px]"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="btn btn-secondary flex-1 min-w-[200px]"
                >
                  Register
                </Link>
              </div>
            </div>
           )} 
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-3">Recent Travel Logs</h2>
            <p className="text-gray-600 mb-4">
              Explore shared experiences from our community travelers.
            </p>
            <Link 
              to="/travel-logs" 
              className="text-primary-600 hover:underline font-medium"
            >
              Browse all logs →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-3">Popular Destinations</h2>
            <p className="text-gray-600 mb-4">
              Discover trending locations added to wishlists.
            </p>
            <Link 
              to="/wishlists" 
              className="text-primary-600 hover:underline font-medium"
            >
              View wishlists →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}