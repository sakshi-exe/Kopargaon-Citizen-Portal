import React from 'react';
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { getConditionColor } from '../../data/infrastructure.js';
import { getWardName } from '../../data/wards.js';
import { formatDate } from '../../utils/formatters.js';
import { QrCode, ShieldCheck } from 'lucide-react';

// Icon emoji per infrastructure type
const TYPE_EMOJI = {
  'Road':            '🛣️',
  'Bridge':          '🌉',
  'Water Tank':      '💧',
  'Water Pipeline':  '💧',
  'Drainage':        '🌊',
  'Street Lights':   '💡',
  'School':          '🏫',
  'Hospital':        '🏥',
  'Park':            '🌳',
  'Public Building': '🏛️',
  'Waste Management':'♻️',
};

function createInfraIcon(condition, type) {
  const color = getConditionColor(condition);
  const emoji = TYPE_EMOJI[type] || '📍';
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${color};
      border:2.5px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function InfrastructureLayer({ visible = true }) {
  const { state, dispatch } = useApp();
  if (!visible) return null;

  return (
    <LayerGroup>
      {state.infrastructure.map(item => {
        const priority = item.condition <= 4 ? 'HIGH' : item.condition <= 6 ? 'MEDIUM' : 'LOW';
        const priorityColor = priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981';

        return (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createInfraIcon(item.condition, item.type)}
          >
            <Popup maxWidth={300} minWidth={260}>
              <div className="font-sans text-slate-800 p-1 space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{TYPE_EMOJI[item.type] || '📍'}</span>
                    <div>
                      <div className="font-mono font-bold text-xs text-blue-700">{item.id}</div>
                      <div className="font-bold text-sm text-slate-900 leading-tight">{item.name}</div>
                    </div>
                  </div>
                </div>

                {/* Information Table */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-medium text-slate-800">Kopargaon ({getWardName(item.wardId)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-800">{item.type} Infrastructure</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Condition</span>
                    <span className="font-bold" style={{ color: getConditionColor(item.condition) }}>
                      {item.condition}/10 ({item.condition >= 8 ? 'Good' : item.condition >= 5 ? 'Fair' : 'Poor'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Inspection</span>
                    <span className="font-medium text-slate-700">{formatDate(item.lastInspection)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Citizen Reports</span>
                    <span className="font-bold text-red-600">{item.citizenReports || 0} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status</span>
                    <span className="font-semibold text-slate-800">{item.maintenanceStatus}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Priority Level</span>
                    <span className="font-bold text-xs" style={{ color: priorityColor }}>{priority} PRIORITY</span>
                  </div>
                </div>

                {/* QR Modal Trigger Button */}
                <button
                  onClick={() => dispatch({ type: 'OPEN_ASSET_MODAL', payload: item })}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <QrCode size={13} /> View Verified QR & Public History
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </LayerGroup>
  );
}
