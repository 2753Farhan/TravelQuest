import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Cefalo Travel Connect
        </Link>
       
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/travel-logs" className="hover:text-primary-600">
            Travel Logs
          </Link>
          <Link to="/wishlists" className="hover:text-primary-600">
            Wishlists
          </Link>
          <Link to="/groups" className="hover:text-primary-600">
            Groups
          </Link>
        </div>
       
        <div className="flex items-center space-x-4">
          <button className="md:hidden">
            <Bars3Icon className="h-6 w-6" />
          </button>
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline">{user?.username}</span>
              <button
                onClick={logout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="btn btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}