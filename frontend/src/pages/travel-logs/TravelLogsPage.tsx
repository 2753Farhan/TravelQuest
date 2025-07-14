import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getTravelLogs } from '../../api/travelLog'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react'
export default function TravelLogsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState('grid') 
  
  const { 
    data: logs, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['travelLogs', user?.id], 
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve([]) 
      }
      return getTravelLogs(user.id)
    },
    staleTime: 60 * 1000, 
    refetchOnWindowFocus: true 
  })

  
  const filteredLogs = logs?.filter((log: { status: string }) => {
    if (filter === 'all') return true
    return log.status === filter
  })

  const sortedLogs = filteredLogs?.sort((a: { createdAt: string | number | Date; title: string }, b: { createdAt: string | number | Date; title: any }) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const stats = {
    total: logs?.length || 0,
    completed: logs?.filter((log: { status: string }) => log.status === 'completed').length || 0,
    active: logs?.filter((log: { status: string }) => log.status === 'active').length || 0,
    planned: logs?.filter((log: { status: string }) => log.status === 'planned').length || 0
  }

  if (isLoading) return <LoadingSpinner fullPage />

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to load travel logs</h3>
            <p className="text-gray-600 mb-6">Something went wrong while loading your travel logs. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const StatsSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Logs</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">{stats.active}</div>
        <div className="text-sm text-gray-600">Active</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-2xl font-bold text-orange-600 mb-1">{stats.planned}</div>
        <div className="text-sm text-gray-600">Planned</div>
      </div>
    </div>
  )

  const FilterSortControls = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="planned">Planned</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">No travel logs yet</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start documenting your travels by creating your first log. Share your experiences and inspire others!
      </p>
      <Link 
        to="/travel-logs/new" 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-block"
      >
        Create Your First Log
      </Link>
    </div>
  )

const GridView = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {sortedLogs?.map((log: any) => (
      <div key={log.logId} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group transform hover:scale-105">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {log.title}
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                log.status === 'completed' ? 'bg-green-100 text-green-800' :
                log.status === 'active' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {log.status}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Link 
                to={`/travel-logs/${log.logId}/edit`}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-lg"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
            </div>
          </div>
          
          {log.description && (
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
              {log.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(log.createdAt).toLocaleDateString()}
            </div>
            {log.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{log.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 pb-4">
          <Link 
            to={`/travel-logs/${log.logId}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    ))}
  </div>
)
const ListView = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="divide-y divide-gray-200">
      {sortedLogs?.map((log: { logId: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
        <div key={log.logId} className="group hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between p-6">
            <Link to={`/travel-logs/${log.logId}`} className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {log.title}
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  log.status === 'completed' ? 'bg-green-100 text-green-800' :
                  log.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {log.status}
                </span>
              </div>
              
              {log.description && (
                <p className="text-gray-600 mb-2 line-clamp-2">{log.description}</p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(log.createdAt).toLocaleDateString()}
                </div>
                {log.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {log.location}
                  </div>
                )}
              </div>
            </Link>
            
            <div className="flex items-center gap-2 ml-4">
              <Link 
                to={`/travel-logs/${log.logId}/edit`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <Link 
                to={`/travel-logs/${log.logId}`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                title="View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Travel Logs</h1>
              <p className="text-gray-600">Document and share your travel experiences</p>
            </div>
            <Link 
              to="/travel-logs/new" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Log
            </Link>
          </div>

          {/* Stats */}
          <StatsSection />

          {/* Filter/Sort Controls */}
          {logs?.length > 0 && <FilterSortControls />}

          {/* Content */}
          {logs?.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Results Info */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {sortedLogs?.length || 0} of {logs?.length || 0} travel logs
                  {filter !== 'all' && ` • Filtered by: ${filter}`}
                </p>
              </div>

              {/* Logs Display */}
              {view === 'grid' ? <GridView /> : <ListView />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}