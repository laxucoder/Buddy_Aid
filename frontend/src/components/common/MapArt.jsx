import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';
import { useEffect } from 'react';

import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.setView(
      [location.latitude, location.longitude],
      16,
      { animate: true }
    );
  }, [location, map]);

  return null;
}

export default function MapArt({
  live = false,
  compact = false,
  location = null,
  seconds = 0,
}) {
  const defaultCenter = [28.4595, 77.0266];

  const center = location
    ? [location.latitude, location.longitude]
    : defaultCenter;

  return (
    <div
      className={`overflow-hidden rounded-2xl ${
        compact ? 'min-h-[190px]' : ''
      }`}
      style={{
        height: compact ? '190px' : '500px',
        width: '100%',
        position: 'relative',
      }}
    >
      <MapContainer
        center={center}
        zoom={location ? 16 : 13}
        scrollWheelZoom
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap location={location} />

        {location && (
          <Marker
            position={[
              location.latitude,
              location.longitude,
            ]}
          >
            <Popup>
              <strong>Your Emergency Location</strong>
              <br />
              Live location sharing
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {live && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-[1000]">
          <span className="badge bg-white text-[#25304d] shadow-sm">
            Live Emergency
          </span>

          <span className="badge bg-[#fff0f4] text-[#f31e56] shadow-sm">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}