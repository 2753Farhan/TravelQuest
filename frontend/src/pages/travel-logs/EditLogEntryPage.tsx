import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLogEntry, getLogEntryById } from '../../api/logEntries'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../../ui/LoadingSpinner'

type FormData = {
  title: string
  placeId?: string | null
  transportRouteId?: string | null
  cost?: number | null
  timeSpent?: string | null
  effortRating?: number | null
  rating?: number | null
  details?: string | Record<string, any> 
}
type ApiLogEntryData = {
  title: string
  placeId?: string  
  transportRouteId?: string  
  cost?: number
  timeSpent?: string
  effortRating?: number
  rating?: number
  details?: Record<string, any>
}

export default function EditLogEntryPage() {
  const { logId, entryId } = useParams<{ logId: string; entryId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  const { data: entry, isLoading } = useQuery({
    queryKey: ['logEntry', entryId],
    queryFn: async () => {
      if (!entryId) throw new Error('Entry ID is missing')
      const data = await getLogEntryById(entryId, true)
      
      
      reset({
        title: data.title,
        placeId: data.placeId ?? null,
        transportRouteId: data.transportRouteId ?? null,
        cost: data.cost ?? null,
        timeSpent: data.timeSpent ?? null,
        effortRating: data.effortRating ?? null,
        rating: data.rating ?? null,
        details: data.details ? JSON.stringify(data.details, null, 2) : undefined,
      })
      return data
    },
    enabled: !!entryId, 
  })

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!entryId) throw new Error('Entry ID is missing')

     const formattedData = {
      title: data.title,
      placeId: data.placeId ?? undefined,
      transportRouteId: data.transportRouteId ?? undefined,
      cost: data.cost ?? undefined,
      timeSpent: data.timeSpent ?? undefined,
      effortRating: data.effortRating ?? undefined,
      rating: data.rating ?? undefined,
      details: typeof data.details === 'string' 
        ? data.details ? JSON.parse(data.details) : undefined
        : data.details
    }
      return updateLogEntry(entryId, formattedData)
    },
    onSuccess: () => {
      if (logId) {
        queryClient.invalidateQueries({ 
          queryKey: ['logEntries', logId] 
        })
      }
      if (entryId) {
        queryClient.invalidateQueries({ 
          queryKey: ['logEntry', entryId] 
        })
      }
      toast.success('Log entry updated successfully!')
      navigate(`/travel-logs/${logId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update log entry')
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await updateMutation.mutateAsync(data)
  })

  if (isLoading || !entry) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Log Entry</h1>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="placeId" className="block mb-1 font-medium">
              Place ID (optional)
            </label>
            <input
              id="placeId"
              type="text"
              {...register('placeId')}
              className="input w-full"
            />
          </div>

          <div>
            <label htmlFor="transportRouteId" className="block mb-1 font-medium">
              Transport Route ID (optional)
            </label>
            <input
              id="transportRouteId"
              type="text"
              {...register('transportRouteId')}
              className="input w-full"
            />
          </div>
        </div>

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
              {...register('effortRating', { 
                valueAsNumber: true,
                min: { value: 1, message: 'Minimum rating is 1' },
                max: { value: 5, message: 'Maximum rating is 5' }
              })}
              className="input w-full"
            />
            {errors.effortRating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.effortRating.message as string}
              </p>
            )}
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
              {...register('rating', { 
                valueAsNumber: true,
                min: { value: 1, message: 'Minimum rating is 1' },
                max: { value: 5, message: 'Maximum rating is 5' }
              })}
              className="input w-full"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message as string}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="details" className="block mb-1 font-medium">
            Additional Details (JSON, optional)
          </label>
          <textarea
            id="details"
            {...register('details', {
              setValueAs: (value) => {
                if (!value) return undefined
                try {
                  return JSON.parse(value)
                } catch {
                  return value 
                }
              },
              validate: (value) => {
                if (!value) return true
                if (typeof value === 'string') {
                  try {
                    JSON.parse(value)
                    return true
                  } catch {
                    return 'Must be valid JSON'
                  }
                }
                return true
              }
            })}
            className="input w-full min-h-[100px] font-mono text-sm"
            placeholder='{"key": "value"}'
          />
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.message as string || 'Invalid JSON format'}
            </p>
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
            className="btn btn-primary" 
            disabled={isSubmitting || updateMutation.isPending}
          >
            {isSubmitting || updateMutation.isPending ? (
              <span className="flex items-center">
                <LoadingSpinner className="mr-2"  />
                Updating...
              </span>
            ) : (
              'Update Entry'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}