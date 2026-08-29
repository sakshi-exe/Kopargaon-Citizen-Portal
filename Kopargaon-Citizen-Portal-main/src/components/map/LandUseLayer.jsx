import React from 'react';
import { Polygon, Tooltip, LayerGroup } from 'react-leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { getLanduseColor, LANDUSE_FILL_OPACITY } from '../../data/landuse.js';
import { getWardName } from '../../data/wards.js';

export default function LandUseLayer({ visible = true }) {
  const { state } = useApp();
  if (!visible) return null;

  return (
    <LayerGroup>
      {state.landUseZones.map(zone => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: getLanduseColor(zone.type),
            fillColor: getLanduseColor(zone.type),
            fillOpacity: LANDUSE_FILL_OPACITY,
            weight: 1.5,
            opacity: 0.8,
          }}
        >
          <Tooltip sticky>
            <div className="font-sans text-xs p-1 min-w-[160px]">
              <div className="font-semibold text-slate-800 mb-1">{zone.name}</div>
              <div className="text-slate-500">{zone.type}</div>
              <div className="text-slate-500">{getWardName(zone.wardId)}</div>
              <div className="text-slate-500">{zone.area} km² · {zone.developmentStatus}</div>
              {zone.population && (
                <div className="text-slate-500">Population: {zone.population.toLocaleString()}</div>
              )}
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </LayerGroup>
  );
}
