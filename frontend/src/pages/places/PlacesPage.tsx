import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Plus, Navigation, X, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPlaces, getPlaceById, searchPlacesByName, findNearbyPlaces, createPlace, deletePlace } from '../../api/places';
import { useAuth } from '../../hooks/useAuth';
import MapPicker from '../../components/Map/MapPicker';

interface Place {
  place_id: string;
  type: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  distance?: number;
  address?: string;
  details?: Record<string, any>;
}

export default function PlacesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[] | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [radius, setRadius] = useState(1000);
  const [newPlace, setNewPlace] = useState({
    type: 'attractions',
    name: '',
    coordinates: { x: 23.6850, y: 90.3563 },
    address: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const handleMapCoordinateSelect = (x: number, y: number) => {
    setNewPlace((prev) => ({
      ...prev,
      coordinates: { x, y },
    }));
  };

  const { data: placesData, isLoading, error } = useQuery({
    queryKey: ['places', pagination.page, pagination.limit],
    queryFn: () => getPlaces(pagination.page, pagination.limit).then(data => {
      setPagination(prev => ({
        ...prev,
        total: data.total || data.totalItems || 0, // Adjust based on API
      }));
      return data;
    }),
  });

  const places = placesData?.data || [];

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination(prev => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    try {
      const results = await searchPlacesByName(searchTerm);
      setFilteredPlaces(results);
      setNearbyPlaces(null);
      toast.success(`Found ${results.length} places`);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to search places');
      setFilteredPlaces(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredPlaces(null);
    setNearbyPlaces(null);
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handleFindNearby = async () => {
    if (!selectedPlaceId) {
      toast.error('Please select a reference place');
      return;
    }
    if (radius <= 0) {
      toast.error('Please enter a valid radius');
      return;
    }
    if (!places || places.length === 0) {
      toast.error('No places available. Please try again later.');
      return;
    }

    try {
      const selectedPlace = places.find((place: Place) => place.place_id.toString() === selectedPlaceId.toString());
      if (!selectedPlace) {
        toast.error('Selected place not found in available places');
        return;
      }

      if (
        typeof selectedPlace.coordinates.x !== 'number' ||
        typeof selectedPlace.coordinates.y !== 'number' ||
        isNaN(selectedPlace.coordinates.x) ||
        isNaN(selectedPlace.coordinates.y)
      ) {
        toast.error('Selected place has invalid coordinates');
        return;
      }

      const results = await findNearbyPlaces(selectedPlace.coordinates.x, selectedPlace.coordinates.y, radius);
      setNearbyPlaces(results);
      setFilteredPlaces(null);
      toast.success(`Found ${results.length} nearby places within ${radius}m`);
    } catch (err: any) {
      console.error('Error finding nearby places:', err.message, err.stack);
      toast.error('Failed to find nearby places: ' + (err.message || 'Unknown error'));
      setNearbyPlaces(null);
    }
  };

  const handleClearNearby = () => {
    setNearbyPlaces(null);
    setSelectedPlaceId('');
    setRadius(1000);
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(newPlace.coordinates.x) || isNaN(newPlace.coordinates.y)) {
      toast.error('Please select valid coordinates');
      return;
    }
    try {
      const createdPlace = await createPlace({
        type: newPlace.type,
        name: newPlace.name,
        x: newPlace.coordinates.x,
        y: newPlace.coordinates.y,
        address: newPlace.address,
      });
      toast.success(`Place ${createdPlace.name} created!`);
      setNewPlace({ type: 'attractions', name: '', coordinates: { x: 23.6850, y: 90.3563 }, address: '' });
      setFilteredPlaces(null);
      setNearbyPlaces(null);
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    } catch (err: any) {
      console.error('Error creating place:', err.message, err.stack);
      toast.error('Failed to create place: ' + err.message || 'Unknown error');
    }
  };

  const handleGetPlaceById = async (placeId: string) => {
    try {
      const place = await getPlaceById(placeId);
      toast.success(`Fetched place: ${place.name}`);
    } catch (err) {
      toast.error('Failed to fetch place');
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'attractions': return '🏛️';
      case 'dining': return '🍽️';
      case 'lodging': return '🏨';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attractions': return 'bg-purple-100 text-purple-800';
      case 'dining': return 'bg-orange-100 text-orange-800';
      case 'lodging': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Explore Places
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover, search, and manage locations with our comprehensive places directory
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Search Places
                </h2>
                {(filteredPlaces || nearbyPlaces) && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-500" />
                  Find Nearby
                </h2>
                {nearbyPlaces && (
                  <button
                    onClick={handleClearNearby}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Place</label>
                  <select
                    value={selectedPlaceId}
                    onChange={(e) => setSelectedPlaceId(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
                    disabled={isLoading || !!error}
                  >
                    <option value="">Select a place</option>
                    {places?.map((place: Place) => (
                      <option key={place.place_id} value={place.place_id}>
                        {place.name} ({place.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value) || 1000)}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
                    min="1"
                    disabled={isLoading || !!error}
                  />
                </div>
                
                <button
                  onClick={handleFindNearby}
                  className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                  disabled={isLoading || !!error || !selectedPlaceId}
                >
                  <Navigation className="w-4 h-4" />
                  Find Nearby
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  {nearbyPlaces ? 'Nearby Places' : filteredPlaces ? 'Search Results' : 'All Places'}
                </h2>
                <div className="text-sm text-gray-500">
                  {!nearbyPlaces && !filteredPlaces && `${pagination.total} places`}
                  {filteredPlaces && `${filteredPlaces.length} results`}
                  {nearbyPlaces && `${nearbyPlaces.length} nearby`}
                </div>
              </div>

              {!nearbyPlaces && !filteredPlaces && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <select
                      value={pagination.limit}
                      onChange={(e) => handleLimitChange(Number(e.target.value))}
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading places...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">Error loading places</p>
                </div>
              )}

              {(nearbyPlaces || filteredPlaces || places) && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(nearbyPlaces || filteredPlaces || places)?.map((place: Place, index: number) => (
                      <div
                        key={place.place_id || `place-${index}`}
                        className="group relative bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer overflow-hidden"
                        onClick={() => handleGetPlaceById(place.place_id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl mt-1">{getPlaceIcon(place.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {place.name}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(place.type)}`}>
                                {place.type}
                              </span>
                            </div>
                            
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {place.coordinates.x.toFixed(4)}, {place.coordinates.y.toFixed(4)}
                                </span>
                              </div>
                              {place.distance && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-400 text-xs">📏</span>
                                  <span>{place.distance}m away</span>
                                </div>
                              )}
                              {place.address && (
                                <div className="flex items-start gap-1.5">
                                  <span className="text-gray-400 text-xs mt-0.5">📍</span>
                                  <span className="line-clamp-2 text-xs">{place.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                   
               

                  {!isLoading && !error && !nearbyPlaces && !filteredPlaces && pagination.total > pagination.limit && (
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`flex items-center px-4 py-2 rounded-md ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="ml-1">Previous</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => {
                          const pageNum = i + 1;
                          const isVisible = totalPages <= 5 || 
                            (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2) || 
                            pageNum === 1 || pageNum === totalPages;
                          
                          if (!isVisible) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className={`flex items-center px-4 py-2 rounded-md ${pagination.page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        <span className="mr-1">Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {nearbyPlaces && nearbyPlaces.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4 text-gray-300">🗺️</div>
                  <p className="text-gray-500">No nearby places found within {radius}m</p>
                </div>
              )}

              {filteredPlaces && filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4 text-gray-300">🔍</div>
                  <p className="text-gray-500">No places found for "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              Add New Place
            </h2>
            
            <form onSubmit={handleCreatePlace} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter place name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newPlace.type}
                    onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="attractions">Attraction</option>
                    <option value="dining">Dining</option>
                    <option value="lodging">Lodging</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <MapPicker
                  onCoordinateSelect={handleMapCoordinateSelect}
                  initialCoordinates={{ x: newPlace.coordinates.x, y: newPlace.coordinates.y }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    value={newPlace.coordinates.x}
                    onChange={(e) =>
                      setNewPlace({
                        ...newPlace,
                        coordinates: { ...newPlace.coordinates, x: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                    step="0.0000001"
                    min="-90"
                    max="90"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    value={newPlace.coordinates.y}
                    onChange={(e) =>
                      setNewPlace({
                        ...newPlace,
                        coordinates: { ...newPlace.coordinates, y: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                    step="0.0000001"
                    min="-180"
                    max="180"
                    required
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newPlace.name.trim()) {
                        toast.error('Please enter a place name');
                        return;
                      }
                      try {
                        const response = await fetch(
                          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newPlace.name)}`
                        );
                        const results = await response.json();
                        if (results.length > 0) {
                          const firstResult = results[0];
                          const lat = parseFloat(firstResult.lat);
                          const lon = parseFloat(firstResult.lon);
                          setNewPlace((prev) => ({
                            ...prev,
                            coordinates: { x: lat, y: lon },
                            address: firstResult.display_name || '',
                          }));
                          toast.success(`Found ${newPlace.name} at (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
                        } else {
                          toast.error('Location not found');
                        }
                      } catch (error) {
                        toast.error('Error searching for location');
                        console.error('Geocoding error:', error);
                      }
                    }}
                    className="w-full h-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                    disabled={!newPlace.name.trim()}
                  >
                    <Map className="w-4 h-4" />
                    Find Coordinates
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newPlace.address}
                  onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 resize-none text-sm"
                  rows={2}
                  placeholder="Full address will be auto-filled when searching by name"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newPlace.name || isNaN(newPlace.coordinates.x) || isNaN(newPlace.coordinates.y)}
              >
                <Plus className="w-4 h-4" />
                Create Place
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}