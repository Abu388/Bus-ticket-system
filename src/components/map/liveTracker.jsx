import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react'; // Import a suitable icon

// Fix marker icon issue (no changes here)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;


// NEW: A custom button component to re-center the map
function RecenterControl({ position }) {
  const map = useMap();

  const handleRecenter = () => {
    if (position) {
      // Use flyTo for a smooth animated transition
      map.flyTo(position, map.getZoom());
    }
  };

  return (
    <button
      onClick={handleRecenter}
      style={{
        position: 'absolute',
        top: '80px', // Position it below the zoom controls
        left: '10px',
        zIndex: 1000, // Ensure it's on top of map tiles
        backgroundColor: 'white',
        border: '2px solid rgba(0,0,0,0.2)',
        borderRadius: '4px',
        width: '34px',
        height: '34px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Recenter map on your location"
    >
      <LocateFixed size={20} color="#333" />
    </button>
  );
}


// A simple message overlay component (no changes here)
function MapMessage({ title, message }) {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'absolute', // Make sure it covers the map
      top: 0,
      left: 0,
      zIndex: 2000, // Higher z-index than the recenter button
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default function LiveTracker() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('loading');
  const [map, setMap] = useState(null); // State to hold map instance for initial centering

  const defaultCenter = [9.02497, 38.74689];

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    const handleSuccess = (pos) => {
      const newPosition = [pos.coords.latitude, pos.coords.longitude];
      setPosition(newPosition);

      // Only center on the very first successful location fix
      if (status === 'loading') {
         if (map) {
            map.flyTo(newPosition, 15);
         }
      }
      setStatus('found');
    };

    const handleError = (err) => {
      console.error('GPS error:', err.message);
      if (err.code === 1) {
        setStatus('denied');
      } else {
        setStatus('error');
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [status, map]); // Add map to dependencies

  return (
    <div style={{ height: '600px', width: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13} // Start a bit more zoomed out
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap} // Get the map instance
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {status === 'found' && position && (
          <>
            <Marker position={position}>
              <Popup>You are here 🚶</Popup>
            </Marker>
            {/* ADD THE NEW RECENTER BUTTON */}
            <RecenterControl position={position} />
          </>
        )}
        
        {status !== 'found' && (
          <Marker position={defaultCenter}>
            <Popup>Default Location: Addis Ababa</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Display informative overlays based on status */}
      {status === 'loading' && (
        <MapMessage title="Locating..." message="Please wait while we acquire your GPS position." />
      )}
      {status === 'denied' && (
        <MapMessage title="Location Access Denied" message="Please enable location permissions in your browser to see your live position." />
      )}
      {status === 'error' && (
        <MapMessage title="Location Error" message="Could not retrieve your position. Showing default location." />
      )}
      {status === 'unsupported' && (
        <MapMessage title="Geolocation Not Supported" message="Your browser does not support geolocation." />
      )}
    </div>
  );
}