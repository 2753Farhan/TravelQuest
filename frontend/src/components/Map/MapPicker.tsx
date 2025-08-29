import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onCoordinateSelect: (x: number, y: number) => void;
  initialCoordinates?: { x: number; y: number };
}

function LocationMarker({ onCoordinateSelect, initialCoordinates }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialCoordinates ? [initialCoordinates.x, initialCoordinates.y] : null
  );

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onCoordinateSelect(lat, lng);
    },
  });

  useEffect(() => {
    if (initialCoordinates) {
      setPosition([initialCoordinates.x, initialCoordinates.y]);
      map.flyTo([initialCoordinates.x, initialCoordinates.y], map.getZoom());
    }
  }, [initialCoordinates, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

export default function MapPicker({ onCoordinateSelect, initialCoordinates }: MapPickerProps) {
  const defaultCenter: [number, number] = [0, 0]; // Default center (you might want to change this)
  
  return (
    <div className="h-64 w-full">
      <MapContainer
        center={initialCoordinates ? [initialCoordinates.x, initialCoordinates.y] : defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onCoordinateSelect={onCoordinateSelect} 
          initialCoordinates={initialCoordinates} 
        />
      </MapContainer>
    </div>
  );
}