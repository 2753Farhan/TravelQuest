import { useQuery } from '@tanstack/react-query';
import { getTripItemById } from '../../api/travelgroup';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { format } from 'date-fns';
import { getUserById } from '../../api/user';
import { useEffect,useState } from 'react';


interface TripItemDetailsProps {
  tripItemId: string;
}

interface TripItemResponse {
  tripitem: {
    itemId: string;
    groupId: string;
    addedBy: string;
    placeId: string | null;
    transportId: string | null;
    startTime: string;
    endTime: string;
    date: string;
    status: 'proposed' | 'confirmed' | 'rejected';
    votes: Record<string, any>;
    details: Record<string, any>;
    createdAt: string | null;
  };
  transportRoute?: {
    route_id: string;
    start_place_id: string;
    end_place_id: string;
    transport_id: string;
    transport_type: string;
    start_place: {
      place_id: string;
      type: string;
      name: string;
      geo_coordinates: string;
    };
    end_place: {
      place_id: string;
      type: string;
      name: string;
      geo_coordinates: string;
    };
  };

  place?: {
    place_id: string;
    type: string;
    name: string;
    geo_coordinates: string;
    address?: string;
    details?: Record<string, any>;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'proposed':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export default function TripItemDetails({ tripItemId }: TripItemDetailsProps) { 
  
  const [userData, setUserData] = useState<any>(null);
  const { data, isLoading, error } = useQuery<TripItemResponse>({
    queryKey: ['tripItem', tripItemId],
    queryFn: () => getTripItemById(tripItemId),
    enabled: !!tripItemId,
  });

 useEffect(() => {
        if (data?.tripitem?.addedBy) {
        getUserById(data.tripitem.addedBy)
            .then(user => setUserData(user))
            .catch(err => console.error('Error fetching user data:', err));
        }
  }, [data]);


  



  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">
            Error loading trip item: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No trip item data found</p>
      </div>
    );
  }

  const { place, tripitem, transportRoute } = data;
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tripitem.status)}`}>
          {tripitem.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
            <div className="space-y-2">
              {/* <p><span className="font-medium">Added By:</span> {userData.name}</p> */}
              <p><span className="font-medium">Date:</span> {formatDate(tripitem.date)}</p>
              <p><span className="font-medium">Start Time:</span> {formatDateTime(tripitem.startTime)}</p>
              <p><span className="font-medium">End Time:</span> {formatDateTime(tripitem.endTime)}</p>
            </div>
          </div>

          {Object.keys(tripitem.details).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(tripitem.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Transport Information */}
        {transportRoute && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transport Details</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium mb-2">{transportRoute.transport_type.toUpperCase()}</p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-xs">A</span>
                  </div>
                  <div>
                    <p className="font-medium">From</p>
                    <p>{transportRoute.start_place.name}</p>
                    {/* <p className="text-sm text-gray-500">Place ID: {transportRoute.start_place_id}</p> */}

                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-xs">B</span>
                  </div>
                  <div>
                    <p className="font-medium">To</p>
                    <p>{transportRoute.end_place.name}</p>
                    {/* <p className="text-sm text-gray-500">Place ID: {transportRoute.end_place_id}</p> */}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm">
                    {/* <span className="font-medium">Route ID:</span> {transportRoute.route_id} */}
                  </p>
                  <p className="text-sm">
                    {/* <span className="font-medium">Transport ID:</span> {transportRoute.transport_id} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Place Information */}
        {tripitem.placeId && !transportRoute && place && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Place Information</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              {/* <p className="font-medium">Place ID: {tripitem.placeId}</p> */}
                <p className="text-sm">{place.name}</p>
                <p className="text-sm text-gray-500">Type: {place.type}</p>
                {place.address && <p className="text-sm text-gray-500">Address: {place.address}</p>}
                {/* {place.details && Object.keys(place.details).length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">Additional Details</h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(place.details, null, 2)}
                    </pre>
                  </div>
                )} */}
            </div>
          </div>
        )}
      </div>

      {/* Votes */}
      {Object.keys(tripitem.votes).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Votes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(Object.keys(tripitem.votes).length, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Created At */}
      {tripitem.createdAt && (
        <div className="mt-6 text-sm text-gray-500">
          Created: {formatDateTime(tripitem.createdAt)}
        </div>
      )}
    </div>
  );
}



