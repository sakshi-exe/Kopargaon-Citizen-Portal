import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import InfrastructureLayer from './InfrastructureLayer.jsx';
import ProjectsLayer from './ProjectsLayer.jsx';
import LandUseLayer from './LandUseLayer.jsx';
import IssuesLayer from './IssuesLayer.jsx';

// City center: Kopargaon urban area, Ahmednagar Dist, Maharashtra
import { KOPARGAON_CENTER } from '../../data/wards.js';
const CITY_CENTER = KOPARGAON_CENTER;
const DEFAULT_ZOOM = 14;

// Fix Leaflet default icon issue in Vite
// We use DivIcon for all custom markers, so no need to fix default icons.

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

// Attribution for OpenStreetMap
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function MapView({
  height = '100%',
  center = CITY_CENTER,
  zoom = DEFAULT_ZOOM,
  onMapClick = null,
  locationPickMode = false,
  pickedLocation = null,
  showLayerToggle = true,
  extraMarkers = [],   // additional markers to render
  className = '',
}) {
  const { state } = useApp();
  const { mapLayers } = state;

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        className="rounded-lg overflow-hidden"
        onClick={onMapClick}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          attribution={OSM_ATTRIBUTION}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* MapController for programmatic view changes */}
        <MapController center={center} zoom={zoom} />

        {/* Data layers — each conditionally rendered based on mapLayers state */}
        <InfrastructureLayer visible={true} />
        <ProjectsLayer visible={mapLayers.projects} />
        <LandUseLayer visible={mapLayers.landuse} />
        <IssuesLayer visible={mapLayers.issues} />

        {/* Location pick indicator */}
        {locationPickMode && pickedLocation && (
          <LocationPickMarker position={pickedLocation} />
        )}
      </MapContainer>
    </div>
  );
}

// Marker shown when citizen is picking a location
function LocationPickMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    const marker = L.marker(position, {
      icon: L.divIcon({
        html: `<div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.4)"></div>`,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
    }).addTo(map);
    return () => map.removeLayer(marker);
  }, [position, map]);
  return null;
}

export { CITY_CENTER, DEFAULT_ZOOM };
