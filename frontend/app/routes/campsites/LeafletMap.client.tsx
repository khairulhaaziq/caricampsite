import {
  MapContainer,
  Marker,
  Popup,
  TileLayer
} from 'react-leaflet';

export default function LeafletMap({ position=[3.1963428597407795, 101.72791987116433] }) {
  return (
    <div className="rounded-lg overflow-hidden aspect-video">
      <>
        <MapContainer
          style={{
            height: '100%',
          }}
          center={position}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://api.maptiler.com/maps/bright-v2/{z}/{x}/{y}.png?key=IhbIuynUzXhMzZkfj1KU"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </>
    </div>
  );
}
