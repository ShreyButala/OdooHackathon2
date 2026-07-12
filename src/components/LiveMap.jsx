import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for hubs and active vehicles
const hubIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordinates for Hubs
const HUBS = {
  Delhi: [28.6139, 77.2090],
  Mumbai: [19.0760, 72.8777],
  Pune: [18.5204, 73.8567],
  Bangalore: [12.9716, 77.5946]
};

export default function LiveMap() {
  // Center roughly in central India
  const center = [23.0225, 76.5714];
  
  // Simulated dynamic vehicle tracking between hubs
  const [vehiclePos, setVehiclePos] = useState([23.8449, 75.0433]);

  // A very rudimentary animation to make the map look "live"
  useEffect(() => {
    const start = [28.6139, 77.2090]; // Delhi
    const end = [19.0760, 72.8777];   // Mumbai
    let progress = 0.3; // start 30% of the way

    const interval = setInterval(() => {
      progress += 0.005;
      if (progress > 1) progress = 0;
      
      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;
      setVehiclePos([lat, lng]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border z-0 relative">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hubs */}
        <Marker position={HUBS.Delhi} icon={hubIcon}>
          <Popup>Delhi Primary Hub</Popup>
        </Marker>
        <Marker position={HUBS.Mumbai} icon={hubIcon}>
          <Popup>Mumbai HQ</Popup>
        </Marker>
        <Marker position={HUBS.Pune} icon={hubIcon}>
          <Popup>Pune Depot</Popup>
        </Marker>

        {/* Route Line */}
        <Polyline 
          positions={[HUBS.Delhi, HUBS.Mumbai]} 
          color="#163A5F" 
          weight={3} 
          dashArray="10, 10" 
          opacity={0.5} 
        />

        {/* Active Vehicle */}
        <Marker position={vehiclePos} icon={activeIcon}>
          <Popup>MH-12-TR-9981 (Active)<br/>En route to Mumbai HQ</Popup>
        </Marker>

      </MapContainer>
    </div>
  );
}
