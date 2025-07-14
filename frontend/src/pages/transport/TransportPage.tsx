import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getTransportOptions, getTransportById, getTransportRoutes, createTransportOption, createTransportRoute } from '../../api/transports';
import { getPlaces } from '../../api/places';
import { useAuth } from '../../hooks/useAuth';

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
  cost?: number | undefined;
  duration?: string;
  details?: Record<string, any>;
}

interface Place {
  place_id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  address?: string;
  details?: Record<string, any>;
}

export default function TransportsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [startPlaceId, setStartPlaceId] = useState('');
  const [endPlaceId, setEndPlaceId] = useState('');
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[] | null>(null);
  const [newTransportOption, setNewTransportOption] = useState({
    transport_type: 'bus',
    provider: '',
    details: {},
  });
  const [newTransportRoute, setNewTransportRoute] = useState({
    transport_id: '',
    start_place_id: '',
    end_place_id: '',
    cost: undefined as number | undefined,
    duration: '',
    details: {},
  });

  
  const { data: transportOptions, isLoading: isLoadingTransports, error: transportError } = useQuery({
    queryKey: ['transportOptions'],
    queryFn: getTransportOptions,
  });

  
  const { data: places, isLoading: isLoadingPlaces, error: placesError } = useQuery({
    queryKey: ['places'],
    queryFn: () => getPlaces(),
    });

  
  const handleGetTransportById = async (transportId: string) => {
    try {
      const transport = await getTransportById(transportId);
      toast.success(`Fetched transport: ${transport.transport_type}`);
    } catch (err: any) {
      console.error('Error fetching transport:', err.message, err.stack);
      toast.error('Failed to fetch transport');
    }
  };

  
  const handleGetTransportRoutes = async () => {
    if (!startPlaceId || !endPlaceId) {
      toast.error('Please select both start and end places');
      return;
    }
    try {
      const routes = await getTransportRoutes(startPlaceId, endPlaceId);
      setTransportRoutes(routes);
      toast.success(`Found ${routes.length} routes`);
    } catch (err: any) {
      console.error('Error fetching transport routes:', err.message, err.stack);
      toast.error('Failed to fetch transport routes');
      setTransportRoutes(null);
    }
  };

  
  const handleCreateTransportOption = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdOption = await createTransportOption(newTransportOption);
      toast.success(`Transport option ${createdOption.transport_type} created!`);
      setNewTransportOption({ transport_type: 'bus', provider: '', details: {} });
      await queryClient.invalidateQueries({ queryKey: ['transportOptions'] });
    } catch (err: any) {
      console.error('Error creating transport option:', err.message, err.stack);
      toast.error('Failed to create transport option');
    }
  };

  
  const handleCreateTransportRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransportRoute.transport_id || !newTransportRoute.start_place_id) {
      toast.error('Transport ID and Start Place are required');
      return;
    }
    try {
      const createdRoute = await createTransportRoute(newTransportRoute);
      toast.success(`Transport route created!`);
      setNewTransportRoute({ transport_id: '', start_place_id: '', end_place_id: '', cost: 0, duration: '', details: {} });
      setTransportRoutes(null); 
      await queryClient.invalidateQueries({ queryKey: ['transportOptions'] }); 
    } catch (err: any) {
      console.error('Error creating transport route:', err.message, err.stack);
      toast.error('Failed to create transport route: ' + (err.message || 'Unknown error'));
    }
  };

  
  if (places) {
    places.forEach((place: Place, index: number) => {
      if (!place.place_id) {
        console.warn(`Place at index ${index} has no ID:`, place);
      }
      if (typeof place.x !== 'number' || typeof place.y !== 'number' || isNaN(place.x) || isNaN(place.y)) {
        console.warn(`Place at index ${index} has invalid coordinates:`, place);
      }
    });
  }
  if (transportOptions) {
    transportOptions.forEach((option: TransportOption, index: number) => {
      if (!option.transport_id) {
        console.warn(`Transport option at index ${index} has no ID:`, option);
      }
    });
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'flight': return '✈️';
      case 'car': return '🚗';
      default: return '🚌';
    }
  };

  const getTransportColor = (type: string) => {
    switch (type) {
      case 'bus': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'train': return 'bg-green-100 text-green-800 border-green-200';
      case 'flight': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'car': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🚀 Transport Hub
          </h1>
          <p className="text-xl text-gray-600">Manage transport options and discover routes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
                <span className="text-white text-xl">🚌</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Transport Options</h2>
            </div>
            
            {isLoadingTransports && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading transport options...</span>
              </div>
            )}
            
            {transportError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                ⚠️ Error loading transport options
              </div>
            )}
            
            {transportOptions && transportOptions.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transportOptions.map((option: TransportOption, index: number) => (
                  <div
                    key={option.transport_id || `temp-transport-${option.transport_type}-${index}`}
                    className={`${getTransportColor(option.transport_type)} rounded-xl p-4 cursor-pointer 
                      hover:shadow-md transition-all duration-200 border `}
                    
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTransportIcon(option.transport_type)}</span>
                        <div>
                          <h3 className="font-semibold text-lg capitalize">{option.transport_type}</h3>
                          {option.provider && <p className="text-sm opacity-80">Provider: {option.provider}</p>}
                        </div>
                      </div>
                    </div>
                    {option.details && Object.keys(option.details).length > 0 && (
                      <div className="mt-2 text-xs opacity-70">
                        Details: {JSON.stringify(option.details)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">🚫</span>
                No transport options available
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full mr-4">
                <span className="text-white text-xl">🗺️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Find Routes</h2>
            </div>
            
            {isLoadingPlaces && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                <span className="ml-2 text-gray-600">Loading places...</span>
              </div>
            )}
            
            {placesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
                ⚠️ Error loading places
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Start Place</label>
                <select
                  value={startPlaceId}
                  onChange={(e) => setStartPlaceId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                  disabled={isLoadingPlaces || !!placesError}
                >
                  <option value="">Select a start place</option>
                  {places?.map((place: Place) => (
                    <option key={place.place_id || `temp-place-${place.name}-${place.type}`} value={place.place_id}>
                      {place.name} ({place.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 End Place</label>
                <select
                  value={endPlaceId}
                  onChange={(e) => setEndPlaceId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                  disabled={isLoadingPlaces || !!placesError}
                >
                  <option value="">Select an end place</option>
                  {places?.map((place: Place) => (
                    <option key={place.place_id || `temp-place-${place.name}-${place.type}`} value={place.place_id}>
                      {place.name} ({place.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleGetTransportRoutes}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoadingPlaces || !!placesError || !startPlaceId || !endPlaceId}
              >
                🔍 Find Routes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4">
              <span className="text-white text-xl">🛤️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Available Routes</h2>
          </div>
          
          {transportRoutes === null ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">🗺️</span>
              <p className="text-lg">Select start and end places to find routes</p>
            </div>
          ) : transportRoutes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">🚫</span>
              <p className="text-lg">No routes found between selected places</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportRoutes.map((route: TransportRoute, index: number) => {
                const transport = transportOptions?.find((opt: TransportOption) => opt.transport_id === route.transport_id);
                const startPlace = places?.find((place: Place) => place.place_id === route.start_place_id);
                const endPlace = places?.find((place: Place) => place.place_id === route.end_place_id);
                return (
                  <div key={route.route_id || `temp-route-${index}`} 
                       className={`${getTransportColor(transport?.transport_type || 'bus')} 
                         rounded-xl p-6 border hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{getTransportIcon(transport?.transport_type || 'bus')}</span>
                      <h3 className="font-bold text-lg">
                        {transport ? transport.transport_type : 'Unknown Transport'} Route
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>From: <strong>{startPlace ? startPlace.name : 'Unknown'}</strong> ({startPlace ? startPlace.type : ''})</span>
                      </div>
                      
                      {route.end_place_id && (
                        <div className="flex items-center">
                          <span className="mr-2">🎯</span>
                          <span>To: <strong>{endPlace ? endPlace.name : 'Unknown'}</strong> ({endPlace ? endPlace.type : ''})</span>
                        </div>
                      )}
                      
                      {route.cost !== undefined && (
                        <div className="flex items-center">
                          <span className="mr-2">💰</span>
                          <span>Cost: <strong>${route.cost.toFixed(2)}</strong></span>
                        </div>
                      )}
                      
                      {route.duration && (
                        <div className="flex items-center">
                          <span className="mr-2">⏱️</span>
                          <span>Duration: <strong>{route.duration}</strong></span>
                        </div>
                      )}
                    </div>
                    
                    {route.details && Object.keys(route.details).length > 0 && (
                      <div className="mt-4 text-xs opacity-70 bg-white/50 rounded-lg p-2">
                        Details: {JSON.stringify(route.details)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full mr-4">
                  <span className="text-white text-xl">➕</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add Transport Option</h2>
              </div>
              
  <form onSubmit={handleCreateTransportOption} className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Transport Type</label>
      <select
        value={newTransportOption.transport_type}
        onChange={(e) => setNewTransportOption({ ...newTransportOption, transport_type: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
        required
      >
        <option value="bus">🚌 Bus</option>
        <option value="train">🚆 Train</option>
        <option value="flight">✈️ Flight</option>
        <option value="car">🚗 Car</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider (optional)</label>
      <input
        type="text"
        value={newTransportOption.provider}
        onChange={(e) => setNewTransportOption({ ...newTransportOption, provider: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
        placeholder="Provider name"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Details (JSON, optional)</label>
      <textarea
        value={JSON.stringify(newTransportOption.details || {}, null, 2)}
        onChange={(e) => {
          try {
            setNewTransportOption({ ...newTransportOption, details: JSON.parse(e.target.value) });
          } catch {
            
          }
        }}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm font-mono"
        rows={3}
      />
    </div>
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
    >
      ✨ Create Transport Option
    </button>
  </form>
</div>

<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full mr-4">
                  <span className="text-white text-xl">🛤️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add Transport Route</h2>
              </div>
              
              {isLoadingPlaces && (
                <div className="flex items-center justify-center py-4 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                  <span className="ml-2 text-gray-600">Loading places...</span>
                </div>
              )}
              
              {placesError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
                  ⚠️ Error loading places
                </div>
              )}
              
              <form onSubmit={handleCreateTransportRoute} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🚌 Transport</label>
                  <select
                    value={newTransportRoute.transport_id}
                    onChange={(e) => setNewTransportRoute({ ...newTransportRoute, transport_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                    required
                    disabled={isLoadingTransports || !!transportError}
                  >
                    <option value="">Select a transport</option>
                    {transportOptions?.map((option: TransportOption) => (
                      <option key={option.transport_id || `temp-transport-${option.transport_type}`} value={option.transport_id}>
                        {getTransportIcon(option.transport_type)} {option.transport_type} {option.provider ? `(${option.provider})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Start Place</label>
                  <select
                    value={newTransportRoute.start_place_id}
                    onChange={(e) => setNewTransportRoute({ ...newTransportRoute, start_place_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                    required
                    disabled={isLoadingPlaces || !!placesError}
                  >
                    <option value="">Select a start place</option>
                    {places?.map((place: Place) => (
                      <option key={place.place_id || `temp-place-${place.name}-${place.type}`} value={place.place_id}>
                        {place.name} ({place.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 End Place (Optional)</label>
                  <select
                    value={newTransportRoute.end_place_id}
                    onChange={(e) => setNewTransportRoute({ ...newTransportRoute, end_place_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                    disabled={isLoadingPlaces || !!placesError}
                  >
                    <option value="">Select an end place (optional)</option>
                    {places?.map((place: Place) => (
                      <option key={place.place_id || `temp-place-${place.name}-${place.type}`} value={place.place_id}>
                        {place.name} ({place.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Cost</label>
                    <input
                      type="number"
                      value={newTransportRoute.cost || ''}
                      onChange={(e) =>
                        setNewTransportRoute({
                          ...newTransportRoute,
                          cost: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Duration</label>
                    <input
                      type="text"
                      value={newTransportRoute.duration}
                      onChange={(e) => setNewTransportRoute({ ...newTransportRoute, duration: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                      placeholder="e.g., 2h 30m"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={!newTransportRoute.transport_id || !newTransportRoute.start_place_id}
                >
                  🚀 Create Transport Route
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}