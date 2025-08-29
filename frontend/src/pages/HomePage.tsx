import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTravelLogs } from '../api/travelLog';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatDate } from '../utils/formatDate';
import { Plus, MapPin, Users, ArrowRight, Map, BookOpen, Car, BarChart3 } from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  
  const { data: recentLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['recentLogs'],
    queryFn: () => getTravelLogs(user?.id),
    enabled: isAuthenticated && user?.role !== 'admin', 
  });

  
  const dashboardStats = {
    totalLogs: recentLogs?.length || 0,
    totalPlaces: recentLogs?.reduce((acc: any, log: { places: string | any[]; }) => acc + (log.places?.length || 0), 0) || 0,
    totalDistance: recentLogs?.reduce((acc: any, log: { distance: any; }) => acc + (log.distance || 0), 0) || 0,
    countriesVisited: new Set(recentLogs?.map((log: { country: any; }) => log.country).filter(Boolean)).size || 0,
  };

  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  const WelcomeSection = () => (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
        Welcome to Cefalo Travel Connect
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {isAuthenticated
          ? `Hello ${user?.username}! Ready for your next adventure?`
          : 'Share your travel experiences with colleagues and explore the world together'}
      </p>
    </div>
  );

  const DashboardStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-2xl font-semibold text-gray-900">{dashboardStats.totalLogs}</div>
        <div className="text-sm text-gray-500">Travel Logs</div>
      </div>
      <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <div className="text-2xl font-semibold text-gray-900">{dashboardStats.totalPlaces}</div>
        <div className="text-sm text-gray-500">Places Visited</div>
      </div>
      <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <div className="text-2xl font-semibold text-gray-900">{dashboardStats.totalDistance}</div>
        <div className="text-sm text-gray-500">KM Traveled</div>
      </div>
      <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
          <Map className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-2xl font-semibold text-gray-900">{dashboardStats.countriesVisited}</div>
        <div className="text-sm text-gray-500">Countries</div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <Link
        to="/travel-logs/new"
        className="group p-6 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">New Travel Log</h3>
        <p className="text-sm text-gray-600">Document your latest adventure</p>
      </Link>
      <Link
        to="/places"
        className="group p-6 bg-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Explore Places</h3>
        <p className="text-sm text-gray-600">Discover new destinations</p>
      </Link>
      <Link
        to="/transports"
        className="group p-6 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
          <Car className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Transportation</h3>
        <p className="text-sm text-gray-600">Find transport options</p>
      </Link>
    </div>
  );

  const MainActions = () => (
    <div className="max-w-md mx-auto space-y-3 mb-12">
      {isAuthenticated ? (
        <>
          <Link
            to="/travel-logs/new"
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Travel Log
          </Link>
          <Link
            to="/places"
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Explore Places
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/auth/register"
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/auth/login"
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );

  const RecentLogsSection = () => (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Recent Travel Logs</h2>
        <Link
          to="/travel-logs"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {logsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : recentLogs?.items?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {recentLogs.items.slice(0, 4).map((log: { logId: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | Date | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <Link
              key={log.logId}
              to={`/travel-logs/${log.logId}`}
              className="block bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{log.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{formatDate(log.createdAt)}</p>
                  {log.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{log.description}</p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No travel logs yet</p>
          <Link
            to="/travel-logs/new"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first travel log →
          </Link>
        </div>
      )}
    </div>
  );

  const FeaturesSection = () => (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Explore the Features</h2>
        <p className="text-gray-600">Everything you need to document and share your travel experiences</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Logs</h3>
          <p className="text-gray-600">
            Document your journeys with photos, routes, and experiences to share with colleagues.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Places</h3>
          <p className="text-gray-600">
            Explore new destinations and get recommendations from fellow travelers.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
          <p className="text-gray-600">
            Connect with colleagues and share travel tips and experiences.
          </p>
        </div>
      </div>
    </div>
  );

  const CallToAction = () => (
    <div className="text-center max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {isAuthenticated ? 'Ready for your next adventure?' : 'Join the Cefalo Travel Community'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isAuthenticated
            ? 'Start documenting your travels and inspire others'
            : 'Connect with colleagues, share experiences, and discover amazing destinations'}
        </p>
        <Link
          to={isAuthenticated ? '/travel-logs/new' : '/auth/register'}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {isAuthenticated ? 'Create New Log' : 'Get Started'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <WelcomeSection />
          {isAuthenticated ? (
            <>
              <DashboardStats />
              <QuickActions />
              <RecentLogsSection />
            </>
          ) : (
            <>
              <MainActions />
              <FeaturesSection />
            </>
          )}
          <CallToAction />
        </div>
      </div>
    </div>
  );
}