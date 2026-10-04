import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

export default function BuddyMap() {
  const position = [28.4595, 77.0266];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '20px'
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          📍 Buddy Aid
        </Popup>
      </Marker>
    </MapContainer>
  );
}