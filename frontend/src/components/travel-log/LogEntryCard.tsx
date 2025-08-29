import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogEntryById, deleteLogEntry } from '../../api/logEntries';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Navigation, 
  Info,
  Zap,
  Trash2,
  Loader2
} from 'lucide-react';

interface LogEntryCardProps {
  entryId: string;
  onDelete?: (entryId: string) => void;
}

interface Place {
  name: string;
  type: string;
  address?: string;
}

interface TransportRoute {
  transport?: {
    transportType: string;
  };
  startPlace?: {
    name: string;
  };
  endPlace?: {
    name: string;
  };
  cost?: number;
  duration?: string;
}

interface LogEntry {
  entryId: string;
  logId: string;
  title: string;
  place?: Place;
  transportRoute?: TransportRoute;
  cost?: number;
  timeSpent?: string;
  effortRating?: number;
  rating?: number;
  details?: Record<string, unknown>;
}

export default function LogEntryCard({ entryId, onDelete }: LogEntryCardProps) {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: () => deleteLogEntry(entryId),
    onSuccess: () => {
      toast.success('Entry deleted successfully!');
      // Invalidate both the specific entry and the list of entries
      queryClient.invalidateQueries({ queryKey: ['logEntry', entryId] });
      queryClient.invalidateQueries({ queryKey: ['logEntries'] });
      // Call the onDelete callback if provided
      onDelete?.(entryId);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete entry');
      console.error('Error deleting entry:', error);
    },
  });

    const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteMutation.mutate();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const { 
    data: entry, 
    isLoading: isLoadingEntry, 
    error: entryError 
  } = useQuery<LogEntry>({
    queryKey: ['logEntry', entryId],
    queryFn: () => getLogEntryById(entryId, true),
  });

  if (isLoadingEntry) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>
      </div>
    );
  }

  if (entryError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center text-red-700">
          <Info className="h-5 w-5 mr-2" />
          <span className="font-medium">Error loading entry: {entryError.message}</span>
        </div>
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {entry.title}
          </h3>
          <div className="relative">
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </>
              )}
            </button>

            {/* Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4">
                <p className="text-gray-700 mb-4">Are you sure you want to delete this entry?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelDelete}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Place Details */}
        {entry.place && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <MapPin className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Place Details</h4>
            </div>
            <div className="space-y-2">
              {entry.place.name && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Name:</span>
                  <span className="text-gray-900 ml-2">{entry.place.name}</span>
                </div>
              )}
              {entry.place.type && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Type:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    {entry.place.type}
                  </span>
                </div>
              )}
              {entry.place.address && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Address:</span>
                  <span className="text-gray-600 ml-2">{entry.place.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transport Details */}
        {entry.transportRoute && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Navigation className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Transport Details</h4>
            </div>
            <div className="space-y-2">
              {entry.transportRoute.transport?.transportType && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Type:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                    {entry.transportRoute.transport.transportType}
                  </span>
                </div>
              )}
              
              {(entry.transportRoute.startPlace || entry.transportRoute.endPlace) && (
                <div className="space-y-1">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-16">From:</span>
                    <span className="text-gray-900 ml-2">{entry.transportRoute.startPlace?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-16">To:</span>
                    <span className="text-gray-900 ml-2">{entry.transportRoute.endPlace?.name || 'Unknown'}</span>
                  </div>
                </div>
              )}
              
              {entry.transportRoute.cost != null && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Cost:</span>
                  <span className="text-green-700 font-semibold ml-2">${Number(entry.transportRoute.cost).toFixed(2)}</span>
                </div>
              )}
              
              {entry.transportRoute.duration && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 min-w-16">Duration:</span>
                  <span className="text-gray-900 ml-2">{entry.transportRoute.duration}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Entry Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entry.cost != null && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-900">Entry Cost</span>
              </div>
              <div className="text-lg font-bold text-purple-700">
                ${Number(entry.cost).toFixed(2)}
              </div>
            </div>
          )}

          {entry.timeSpent && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Time Spent</span>
              </div>
              <div className="text-lg font-bold text-blue-700">
                {entry.timeSpent}
              </div>
            </div>
          )}

          {entry.effortRating && (
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-900">Effort</span>
              </div>
              <div className="text-lg font-bold text-orange-700">
                {entry.effortRating}/5
              </div>
            </div>
          )}

          {entry.rating && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-900">Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                {renderRatingStars(entry.rating)}
                <span className="text-sm text-yellow-700 ml-2">({entry.rating}/5)</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Details */}
        {entry.details && Object.keys(entry.details).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Info className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Additional Details</h4>
            </div>
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {JSON.stringify(entry.details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}