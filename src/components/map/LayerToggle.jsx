import React from 'react';
import { Layers, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const LAYERS = [
  { key: 'projects',       label: 'Development Projects', color: '#3b82f6', emoji: '🏗️' },
  { key: 'issues',         label: 'Citizen Issues',        color: '#ef4444', emoji: '📢' },
  { key: 'landuse',        label: 'Land-Use Zones',        color: '#16a34a', emoji: '🗺️' },
];

// For infrastructure sub-layers shown via the InfrastructureLayer (always on,
// this toggle controls the main visibility)
const INFRA_TYPES_DISPLAY = [
  { label: 'Roads & Bridges',     emoji: '🛣️',  color: '#94a3b8' },
  { label: 'Water Infrastructure', emoji: '💧', color: '#60a5fa' },
  { label: 'Drainage',             emoji: '🌊', color: '#34d399' },
  { label: 'Street Lights',        emoji: '💡', color: '#fbbf24' },
  { label: 'Public Buildings',     emoji: '🏛️', color: '#c084fc' },
  { label: 'Parks',                emoji: '🌳', color: '#4ade80' },
  { label: 'Waste / Schools / Hospitals', emoji: '🏥', color: '#fb923c' },
];

export default function LayerToggle({ className = '' }) {
  const { state, dispatch } = useApp();
  const [open, setOpen] = React.useState(false);
  const { mapLayers } = state;

  const toggle = (key) => dispatch({ type: 'TOGGLE_LAYER', payload: key });

  return (
    <div className={`absolute top-4 right-4 z-[400] ${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        title="Toggle map layers"
      >
        <Layers size={18} className="text-slate-600 dark:text-slate-300" />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-12 right-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Map Layers</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={16} />
            </button>
          </div>

          {/* Infrastructure (always visible, shown as static info) */}
          <div className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Infrastructure</div>
            <div className="space-y-1">
              {INFRA_TYPES_DISPLAY.map(t => (
                <div key={t.label} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: t.color, opacity: 0.8 }} />
                  <span>{t.emoji} {t.label}</span>
                  <span className="ml-auto text-slate-400 text-[10px]">Always on</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggleable layers */}
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Overlays</div>
          <div className="space-y-2">
            {LAYERS.map(layer => (
              <label key={layer.key} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!!mapLayers[layer.key]}
                    onChange={() => toggle(layer.key)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-4.5 rounded-full border-2 transition-colors ${
                    mapLayers[layer.key]
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                  }`} style={{ height: '18px' }}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                      mapLayers[layer.key] ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  {layer.emoji} {layer.label}
                </span>
                <span className="ml-auto w-3 h-3 rounded-full flex-shrink-0" style={{ background: layer.color, opacity: mapLayers[layer.key] ? 1 : 0.3 }} />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
