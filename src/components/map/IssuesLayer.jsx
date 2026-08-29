import React from 'react';
import { CircleMarker, Popup, LayerGroup } from 'react-leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { getStatusStyle, STATUS_FLOW } from '../../data/issues.js';
import { getWardName } from '../../data/wards.js';
import { formatDate } from '../../utils/formatters.js';

const CATEGORY_EMOJI = {
  'Road Damage':       '🛣️',
  'Pothole':           '🕳️',
  'Water Problem':     '💧',
  'Drainage':          '🌊',
  'Garbage':           '🗑️',
  'Street Light':      '💡',
  'Public Infrastructure': '🏛️',
  'Traffic':           '🚦',
  'Park':              '🌳',
  'Other':             '📌',
};

export default function IssuesLayer({ visible = true }) {
  const { state } = useApp();
  if (!visible) return null;

  return (
    <LayerGroup>
      {state.issues.map(issue => {
        const style = getStatusStyle(issue.status);
        return (
          <CircleMarker
            key={issue.id}
            center={[issue.lat, issue.lng]}
            radius={8}
            pathOptions={{
              color: style.color,
              fillColor: style.color,
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Popup maxWidth={280} minWidth={240}>
              <div className="font-sans text-slate-800 p-1">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{CATEGORY_EMOJI[issue.category] || '📌'}</span>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{issue.category}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{issue.id} · {getWardName(issue.wardId)}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">{issue.description}</p>
                <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="font-semibold" style={{ color: style.color }}>{issue.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reported</span>
                    <span className="text-slate-700">{formatDate(issue.submittedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">By</span>
                    <span className="text-slate-700">{issue.isAnonymous ? 'Anonymous' : issue.citizenName}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </LayerGroup>
  );
}
