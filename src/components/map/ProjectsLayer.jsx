import React from 'react';
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { getWardName } from '../../data/wards.js';
import { getStatusDot } from '../../data/projects.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { QrCode } from 'lucide-react';

function createProjectIcon(status) {
  const color = getStatusDot(status);
  const emoji = status === 'Completed' ? '✅' : status === 'Delayed' ? '⚠️' : status === 'Planned' ? '📋' : '🏗️';
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:8px;
      background:${color};
      border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

export default function ProjectsLayer({ visible = true }) {
  const { state, dispatch } = useApp();
  if (!visible) return null;

  return (
    <LayerGroup>
      {state.projects.map(project => (
        <Marker
          key={project.id}
          position={[project.lat, project.lng]}
          icon={createProjectIcon(project.status)}
        >
          <Popup maxWidth={300} minWidth={260}>
            <div className="font-sans text-slate-800 p-1">
              <div className="mb-2 border-b border-slate-100 pb-1.5">
                <div className="font-mono font-bold text-xs text-blue-700">{project.id}</div>
                <div className="font-bold text-sm leading-tight text-slate-900">{project.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{getWardName(project.wardId)} · Kopargaon</div>
              </div>
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold" style={{ color: getStatusDot(project.status) }}>{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractor</span>
                  <span className="font-medium text-slate-700 text-right max-w-[130px] leading-tight truncate">{project.contractor || 'KMC PWD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-medium text-slate-700">{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected End</span>
                  <span className="font-medium text-slate-700">{formatDate(project.expectedEnd)}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Execution Progress</span><span>{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} color="auto" size="md" />
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
}
