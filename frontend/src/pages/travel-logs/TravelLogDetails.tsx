import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getTravelLogById } from '../../api/travelLog';
import { getLogEntries, createLogEntry } from '../../api/logEntries';
import { getPlaces } from '../../api/places';
import { getTransportOptions, getTransportRouteByTransportId } from '../../api/transports';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import LogEntryCard from '../../components/travel-log/LogEntryCard';
import type { LogEntry } from '../../types/core';

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

interface TransportOption {
  transport_id: string;
  transport_type: string;
  provider?: string;
  details?: Record<string, any>;
}

interface TransportRoute {
  route_id: string;
  transport_id: string;
  start_place_id: string;
  end_place_id?: string;
  cost?: number;
  duration?: string;
  details?: Record<string, any>;
}

type FormData = {
  title: string;
  entryType: 'place' | 'transport';
  placeId?: string | null;
  transportOptionId?: string | null;
  transportRouteId?: string | null;
  cost?: number;
  timeSpent?: string;
  effortRating?: number;
  rating?: number;
  details?: string;
};

type ApiLogEntryData = {
  logId: string;
  title: string;
  placeId?: string;
  transportOptionId?: string;
  transportRouteId?: string;
  cost?: number;
  timeSpent?: string;
  effortRating?: number;
  rating?: number;
  details?: Record<string, any>;
};

export default function TravelLogDetailPage() {
  const { logId } = useParams<{ logId: string }>();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const placeSelectRef = useRef<HTMLSelectElement>(null);
  const transportOptionRef = useRef<HTMLSelectElement>(null);

  const { data: log, isLoading: isLogLoading } = useQuery({
    queryKey: ['travelLog', logId],
    queryFn: () => getTravelLogById(logId!),
  });

  const { data: entries, isLoading: isEntriesLoading } = useQuery<LogEntry[], Error>({
    queryKey: ['logEntries', logId],
    queryFn: () => getLogEntries(logId!, true),
    enabled: !!logId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      entryType: 'place',
      placeId: null,
      transportOptionId: null,
      transportRouteId: null,
      title: '',
      cost: undefined,
      timeSpent: '',
      effortRating: undefined,
      rating: undefined,
      details: '',
    },
  });

  const entryType = watch('entryType');
  const transportOptionId = watch('transportOptionId');

  // Fetch places
  const { data: places, isLoading: isLoadingPlaces, error: placesError } = useQuery<Place[], Error>({
    queryKey: ['places'],
    queryFn: () => getPlaces(),
  });

  // Fetch transport options
  const { data: transportOptions, isLoading: isLoadingTransportOptions, error: transportOptionsError } = useQuery<
    TransportOption[],
    Error
  >({
    queryKey: ['transportOptions'],
    queryFn: getTransportOptions,
  });

  // Fetch transport routes only when a transport option is selected
  const {
    data: transportRoutes,
    isLoading: isLoadingRoutes,
    error: routesError,
  } = useQuery<TransportRoute[], Error>({
    queryKey: ['transportRoutes', transportOptionId],
    queryFn: () => {
      if (!transportOptionId) return Promise.resolve([]);
      return getTransportRouteByTransportId(transportOptionId);
    },
    enabled: !!transportOptionId,
  });

  // Reset route selection when transport option changes
  useEffect(() => {
    if (transportOptionId) {
      reset((formValues) => ({
        ...formValues,
        transportRouteId: null,
      }));
    }
  }, [transportOptionId, reset]);

  // Filter valid options
  const validPlaces = places?.filter((place) => place.place_id && !place.place_id.startsWith('temp-'));
  const validTransportOptions = transportOptions?.filter(
    (option) => option.transport_id && !option.transport_id.startsWith('temp-')
  );
  const validTransportRoutes = transportRoutes?.filter((route) => route.route_id && !route.route_id.startsWith('temp-'));

  const createMutation = useMutation<void, Error, FormData>({
    mutationFn: async (data: FormData) => {
      if (!logId) {
        throw new Error('Log ID is missing');
      }

      const formattedData: ApiLogEntryData = {
        logId,
        title: data.title,
        placeId: data.entryType === 'place' ? data.placeId ?? undefined : undefined,
        transportOptionId: data.entryType === 'transport' ? data.transportOptionId ?? undefined : undefined,
        transportRouteId: data.entryType === 'transport' ? data.transportRouteId ?? undefined : undefined,
        cost: data.cost,
        timeSpent: data.timeSpent,
        effortRating: data.effortRating,
        rating: data.rating,
        details: data.details ? JSON.parse(data.details) : undefined,
      };

      return createLogEntry(formattedData);
    },
    onSuccess: () => {
      if (logId) {
        queryClient.invalidateQueries({ queryKey: ['logEntries', logId] });
      }
      toast.success('Log entry created successfully!');
    },
    onError: (error) => {
      console.error('Error creating log entry:', error); // Debug error
      toast.error(error.message || 'Failed to create log entry');
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data, event) => {
    const submitter = ((event?.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | null)?.value;
    await createMutation.mutateAsync(data);
    if (submitter === 'create-and-add') {
      reset();
    } else {
      setIsFormOpen(false);
      reset();
    }
  };

  if (isLogLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">{log?.title}</h1>
                  <p className="text-blue-100 text-lg opacity-90">{log?.description}</p>
                </div>
                <Link 
                  to={`/travel-logs/${logId}/edit`} 
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Log
                </Link>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {log?.startDate && new Date(log.startDate).toLocaleDateString()}
                    {log?.endDate && ` - ${new Date(log.endDate).toLocaleDateString()}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log?.status === 'active' ? 'bg-green-100 text-green-800' : 
                    log?.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log?.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log?.visibility === 'public' ? 'bg-green-100 text-green-800' : 
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {log?.visibility}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800 mr-4">Travel Entries</h2>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {entries?.length || 0} entries
              </span>
            </div>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isFormOpen 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isFormOpen ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Entry
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Create New Entry
                </h3>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                      Entry Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Enter a descriptive title..."
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="entryType" className="block text-sm font-semibold text-gray-700">
                      Entry Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                        entryType === 'place' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value="place"
                          {...register('entryType', { required: 'Entry type is required' })}
                          className="sr-only"
                          onChange={(e) => {
                            reset({
                              entryType: e.target.value as 'place' | 'transport',
                              placeId: null,
                              transportOptionId: null,
                              transportRouteId: null,
                              title: '',
                              cost: undefined,
                              timeSpent: '',
                              effortRating: undefined,
                              rating: undefined,
                              details: '',
                            });
                            setTimeout(() => placeSelectRef.current?.focus(), 100);
                          }}
                        />
                        <div className="flex items-center">
                          <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-800">Place</div>
                            <div className="text-sm text-gray-600">Location or destination</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                        entryType === 'transport' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value="transport"
                          {...register('entryType', { required: 'Entry type is required' })}
                          className="sr-only"
                          onChange={(e) => {
                            reset({
                              entryType: e.target.value as 'place' | 'transport',
                              placeId: null,
                              transportOptionId: null,
                              transportRouteId: null,
                              title: '',
                              cost: undefined,
                              timeSpent: '',
                              effortRating: undefined,
                              rating: undefined,
                              details: '',
                            });
                            setTimeout(() => transportOptionRef.current?.focus(), 100);
                          }}
                        />
                        <div className="flex items-center">
                          <svg className="w-8 h-8 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-800">Transport</div>
                            <div className="text-sm text-gray-600">Travel method</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {entryType === 'place' && (
                    <div className="space-y-2">
                      <label htmlFor="placeId" className="block text-sm font-semibold text-gray-700">
                        Select Place
                      </label>
                      {isLoadingPlaces ? (
                        <div className="flex items-center justify-center py-8">
                          <LoadingSpinner className="mr-2" />
                          <span className="text-gray-600">Loading places...</span>
                        </div>
                      ) : placesError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center text-red-700">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Error loading places: {placesError.message}
                          </div>
                        </div>
                      ) : validPlaces?.length === 0 ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center text-orange-700">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            No places available
                          </div>
                        </div>
                      ) : (
                        <select
                          id="placeId"
                          {...register('placeId', { required: 'Place is required' })}
                          ref={(e) => {
                            placeSelectRef.current = e;
                            register('placeId').ref?.(e);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        >
                          <option value="">Choose a place...</option>
                          {validPlaces?.map((place) => (
                            <option key={place.place_id} value={place.place_id}>
                              {place.name} ({place.type})
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.placeId && (
                        <p className="text-red-500 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.placeId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {entryType === 'transport' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="transportOptionId" className="block text-sm font-semibold text-gray-700">
                          Transport Option
                        </label>
                        {isLoadingTransportOptions ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner className="mr-2" />
                            <span className="text-gray-600">Loading transport options...</span>
                          </div>
                        ) : transportOptionsError ? (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center text-red-700">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Error loading transport options: {transportOptionsError.message}
                            </div>
                          </div>
                        ) : (
                          <select
                            id="transportOptionId"
                            {...register('transportOptionId', {
                              required: 'Transport option is required',
                            })}
                            ref={(e) => {
                              transportOptionRef.current = e;
                              register('transportOptionId').ref?.(e);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          >
                            <option value="">Choose transport option...</option>
                            {validTransportOptions?.map((option) => (
                              <option key={option.transport_id} value={option.transport_id}>
                                {option.transport_type} {option.provider ? `(${option.provider})` : ''}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.transportOptionId && (
                          <p className="text-red-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.transportOptionId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="transportRouteId" className="block text-sm font-semibold text-gray-700">
                          Transport Route <span className="text-gray-500 font-normal">(optional)</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            id="transportRouteId"
                            {...register('transportRouteId')}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            disabled={isLoadingRoutes || !!routesError || !validTransportRoutes}
                          >
                            <option value="">Select route (optional)...</option>
                            {isLoadingRoutes ? (
                              <option value="" disabled>Loading routes...</option>
                            ) : routesError ? (
                              <option value="" disabled>Error loading routes</option>
                            ) : validTransportRoutes?.length === 0 ? (
                              <option value="" disabled>No routes available</option>
                            ) : (
                              validTransportRoutes?.map((route) => {
                                const transport = validTransportOptions?.find((opt) => opt.transport_id === route.transport_id);
                                const startPlace = validPlaces?.find((place) => place.place_id === route.start_place_id);
                                const endPlace = validPlaces?.find((place) => place.place_id === route.end_place_id);
                                return (
                                  <option key={route.route_id} value={route.route_id}>
                                    {transport ? transport.transport_type : 'Unknown'} from{' '}
                                    {startPlace ? startPlace.name : 'Unknown'} to {endPlace ? endPlace.name : 'Unknown'}
                                    {route.cost != null ? ` ($${Number(route.cost).toFixed(2)})` : ''}
                                  </option>
                                );
                              })
                            )}
                          </select>
                          <button
                            type="button"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['transportRoutes', transportOptionId] })}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 disabled:opacity-50"
                            disabled={isLoadingRoutes || !transportOptionId}
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="cost" className="block text-sm font-semibold text-gray-700">
                        Cost <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">$</span>
                        </div>
                        <input
                          id="cost"
                          type="number"
                          step="0.01"
                          {...register('cost', { valueAsNumber: true })}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="timeSpent" className="block text-sm font-semibold text-gray-700">
                        Time Spent <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <input
                        id="timeSpent"
                        type="text"
                        {...register('timeSpent')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="e.g., 2 hours, 30 minutes"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="effortRating" className="block text-sm font-semibold text-gray-700">
                        Effort Rating <span className="text-gray-500 font-normal">(1-5, optional)</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="effortRating"
                          type="range"
                          min="1"
                          max="5"
                          {...register('effortRating', { valueAsNumber: true })}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 min-w-[2rem]">
                          {watch('effortRating') || '—'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="rating" className="block text-sm font-semibold text-gray-700">
                        Overall Rating <span className="text-gray-500 font-normal">(1-5, optional)</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="rating"
                          type="range"
                          min="1"
                          max="5"
                          {...register('rating', { valueAsNumber: true })}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 min-w-[2rem]">
                          {watch('rating') || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="details" className="block text-sm font-semibold text-gray-700">
                      Additional Details <span className="text-gray-500 font-normal">(JSON format, optional)</span>
                    </label>
                    <textarea
                      id="details"
                      {...register('details', {
                        validate: (value) => {
                          if (!value) return true;
                          try {
                            JSON.parse(value);
                            return true;
                          } catch {
                            return 'Must be valid JSON format';
                          }
                        },
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-mono text-sm"
                      rows={4}
                      placeholder='{"notes": "Amazing experience!", "weather": "sunny"}'
                    />
                    {errors.details && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.details.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        reset();
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      name="submit"
                      value="create-and-add"
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
                      disabled={isSubmitting || createMutation.isPending}
                    >
                      {isSubmitting || createMutation.isPending ? (
                        <span className="flex items-center">
                          <LoadingSpinner className="mr-2" />
                          Creating...
                        </span>
                      ) : (
                        'Create & Add Another'
                      )}
                    </button>
                    <button
                      type="submit"
                      name="submit"
                      value="create"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 shadow-lg"
                      disabled={isSubmitting || createMutation.isPending}
                    >
                      {isSubmitting || createMutation.isPending ? (
                        <span className="flex items-center">
                          <LoadingSpinner className="mr-2" />
                          Creating...
                        </span>
                      ) : (
                        'Create Entry'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {isEntriesLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner className="mx-auto mb-4" />
                  <p className="text-gray-600">Loading your travel entries...</p>
                </div>
              </div>
            ) : entries?.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Entries Yet</h3>
                  <p className="text-gray-600 mb-6">Start documenting your travel experiences by adding your first entry.</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Your First Entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {entries?.map((entry, index) => (
                  <div
                    key={entry.entryId}
                    className="transform transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <LogEntryCard entryId={entry.entryId} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}