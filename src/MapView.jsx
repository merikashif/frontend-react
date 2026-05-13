import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* FIX ICONE */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapView() {
  return (
    <div className="map-container-custom">

      <MapContainer
        center={[45.5416, 10.2118]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[45.5416, 10.2118]}>
          <Popup>Parcheggio Centro Brescia</Popup>
        </Marker>

        <Marker position={[45.5320, 10.2145]}>
          <Popup>Parcheggio Stazione</Popup>
        </Marker>

        <Marker position={[45.5380, 10.2200]}>
          <Popup>Parcheggio Ospedale</Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}