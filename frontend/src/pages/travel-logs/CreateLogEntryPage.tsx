import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLogEntry } from '../../api/logEntries';
import { getPlaces } from '../../api/places';
import { getTransportRoutes, getTransportOptions } from '../../api/transports';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';

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
  id: string;
  transport_type: string;
  provider?: string;
  details?: Record<string, any>;
}

interface TransportRoute {
  id: string;
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

export default function CreateLogEntryPage() {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
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

  // Fetch transport routes
  const { data: transportRoutes, isLoading: isLoadingRoutes, error: routesError } = useQuery<TransportRoute[], Error>({
    queryKey: ['transportRoutes'],
    queryFn: () => getTransportRoutes(),
  });

  // Fetch transport options
  const { data: transportOptions, isLoading: isLoadingTransportOptions, error: transportOptionsError } = useQuery<
    TransportOption[],
    Error
  >({
    queryKey: ['transportOptions'],
    queryFn: getTransportOptions,
  });

  // Filter valid options
  const validPlaces = places?.filter((place) => place.place_id && !place.place_id.startsWith('temp-'));
  const validTransportOptions = transportOptions?.filter(
    (option) => option.id && !option.id.startsWith('temp-')
  );
  const validTransportRoutes = transportRoutes
    ?.filter((route) => route.id && !route.id.startsWith('temp-'))
    .filter((route) => !transportOptionId || route.transport_id === transportOptionId);

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
      toast.error(error.message || 'Failed to create log entry');
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data, event) => {
    const submitter = ((event?.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | HTMLInputElement | null)?.value;
    await createMutation.mutateAsync(data);
    if (submitter === 'create-and-add') {
      reset();
    } else {
      navigate(`/travel-logs/${logId}`);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Log Entry</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label htmlFor="entryType" className="block mb-1 font-medium">
            Entry Type
          </label>
          <select
            id="entryType"
            {...register('entryType', { required: 'Entry type is required' })}
            className="input w-full"
            onChange={(e) => {
              setValue('placeId', null);
              setValue('transportOptionId', null);
              setValue('transportRouteId', null);
            }}
          >
            <option value="place">Place</option>
            <option value="transport">Transport</option>
          </select>
          {errors.entryType && (
            <p className="text-red-500 text-sm mt-1">{errors.entryType.message}</p>
          )}
        </div>

        {entryType === 'place' && (
          <div>
            <label htmlFor="placeId" className="block mb-1 font-medium">
              Place
            </label>
            {isLoadingPlaces && <div>Loading places...</div>}
            {placesError && <div className="text-red-600">Error loading places: {placesError.message}</div>}
            {!isLoadingPlaces && validPlaces?.length === 0 && (
              <div className="text-red-600">No valid places available (all places missing IDs)</div>
            )}
            <select
              id="placeId"
              {...register('placeId', { required: entryType === 'place' ? 'Place is required' : false })}
              className="input w-full"
              disabled={isLoadingPlaces || !!placesError || !validPlaces || validPlaces.length === 0}
            >
              <option value="">Select a place</option>
              {validPlaces?.map((place) => (
                <option key={place.place_id} value={place.place_id}>
                  {place.name} ({place.type})
                </option>
              ))}
            </select>
            {errors.placeId && (
              <p className="text-red-500 text-sm mt-1">{errors.placeId.message}</p>
            )}
          </div>
        )}

        {entryType === 'transport' && (
          <>
            <div>
              <label htmlFor="transportOptionId" className="block mb-1 font-medium">
                Transport Option
              </label>
              {isLoadingTransportOptions && <div>Loading transport options...</div>}
              {transportOptionsError && (
                <div className="text-red-600">Error loading transport options: {transportOptionsError.message}</div>
              )}
              {!isLoadingTransportOptions && validTransportOptions?.length === 0 && (
                <div className="text-red-600">No valid transport options available (all options missing IDs)</div>
              )}
              <select
                id="transportOptionId"
                {...register('transportOptionId', {
                  required: entryType === 'transport' ? 'Transport option is required' : false,
                })}
                className="input w-full"
                disabled={
                  isLoadingTransportOptions ||
                  !!transportOptionsError ||
                  !validTransportOptions ||
                  validTransportOptions.length === 0
                }
              >
                <option value="">Select a transport option</option>
                {validTransportOptions?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.transport_type} {option.provider ? `(${option.provider})` : ''}
                  </option>
                ))}
              </select>
              {errors.transportOptionId && (
                <p className="text-red-500 text-sm mt-1">{errors.transportOptionId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="transportRouteId" className="block mb-1 font-medium">
                Transport Route (optional)
              </label>
              {isLoadingRoutes && <div>Loading transport routes...</div>}
              {routesError && <div className="text-red-600">Error loading transport routes: {routesError.message}</div>}
              {!isLoadingRoutes && validTransportRoutes?.length === 0 && (
                <div className="text-red-600">No valid transport routes available</div>
              )}
              <select
                id="transportRouteId"
                {...register('transportRouteId')}
                className="input w-full"
                disabled={isLoadingRoutes || !!routesError || !validTransportRoutes || validTransportRoutes.length === 0}
              >
                <option value="">Select a transport route (optional)</option>
                {validTransportRoutes?.map((route) => {
                  const transport = validTransportOptions?.find((opt) => opt.id === route.transport_id);
                  const startPlace = validPlaces?.find((place) => place.place_id === route.start_place_id);
                  const endPlace = validPlaces?.find((place) => place.place_id === route.end_place_id);
                  return (
                    <option key={route.id} value={route.id}>
                      {transport ? transport.transport_type : 'Unknown'} from{' '}
                      {startPlace ? startPlace.name : 'Unknown'} to {endPlace ? endPlace.name : 'Unknown'}
                      {route.cost !== undefined ? ` ($${route.cost.toFixed(2)})` : ''}
                    </option>
                  );
                })}
              </select>
              {errors.transportRouteId && (
                <p className="text-red-500 text-sm mt-1">{errors.transportRouteId.message}</p>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cost" className="block mb-1 font-medium">
              Cost (optional)
            </label>
            <input
              id="cost"
              type="number"
              step="0.01"
              {...register('cost', { valueAsNumber: true })}
              className="input w-full"
            />
          </div>

          <div>
            <label htmlFor="timeSpent" className="block mb-1 font-medium">
              Time Spent (optional)
            </label>
            <input
              id="timeSpent"
              type="text"
              {...register('timeSpent')}
              className="input w-full"
              placeholder="e.g. 2 hours"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="effortRating" className="block mb-1 font-medium">
              Effort Rating (1-5, optional)
            </label>
            <input
              id="effortRating"
              type="number"
              min="1"
              max="5"
              {...register('effortRating', { valueAsNumber: true })}
              className="input w-full"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block mb-1 font-medium">
              Rating (1-5, optional)
            </label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              {...register('rating', { valueAsNumber: true })}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="details" className="block mb-1 font-medium">
            Additional Details (JSON, optional)
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
                  return 'Must be valid JSON';
                }
              },
            })}
            className="input w-full min-h-[100px] font-mono text-sm"
            placeholder='{"key": "value"}'
          />
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/travel-logs/${logId}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            name="submit"
            value="create-and-add"
            className="btn btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {isSubmitting || createMutation.isPending ? (
              <span className="flex items-center">
                <LoadingSpinner className="mr-2" />
                Creating...
              </span>
            ) : (
              'Create and Add Another'
            )}
          </button>
          <button
            type="submit"
            name="submit"
            value="create"
            className="btn btn-primary"
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
  );
}