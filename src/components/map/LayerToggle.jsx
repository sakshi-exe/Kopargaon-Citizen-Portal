import React from 'react';
import { Layers, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function LayerToggle({ className = '' }) {
  const { state, dispatch } = useApp();
  const [open, setOpen] = React.useState(false);
  const { mapLayers, projects, issues, landUseZones, infrastructure } = state;

  const toggle = (key) => dispatch({ type: 'TOGGLE_LAYER', payload: key });

  const LAYERS = [
    { key: 'projects', label: 'Development Projects', count: projects.length, color: '#3b82f6', emoji: '🏗️' },
    { key: 'issues',   label: 'Citizen Issues',      count: issues.length,   color: '#ef4444', emoji: '📢' },
    { key: 'landuse',  label: 'Land-Use Zones',      count: landUseZones.length, color: '#16a34a', emoji: '🗺️' },
  ];

  const activeCount = Object.values(mapLayers).filter(Boolean).length + 1; // +1 for infra

  return (
    <div className={`absolute top-4 right-4 z-[400] ${className}`}>
      {/* Floating Toggle Button with Active Badge */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:border-navy-400 dark:hover:border-navy-500 transition-all font-semibold text-xs text-slate-800 dark:text-slate-200"
        title="Toggle GIS Map Layers"
      >
        <Layers size={16} className="text-navy-700 dark:text-saffron-400" />
        <span className="hidden sm:inline">GIS Layers</span>
        <span className="px-1.5 py-0.2 rounded-full bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-navy-300 font-mono text-[10px] font-bold">
          {activeCount}
        </span>
      </button>

      {/* Layer Selection Dropdown */}
      {open && (
        <div className="absolute top-12 right-0 w-72 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Map Layers & Overlays
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Kopargaon Municipal GIS</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={15} />
            </button>
          </div>

          {/* Infrastructure (Primary Base Layer) */}
          <div className="mb-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span>🏛️</span>
                <span>Municipal Assets</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {infrastructure.length} Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 pl-6">
              Roads, water networks, street lights, bridges & public assets.
            </p>
          </div>

          {/* Overlays */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Toggle Overlays
          </div>
          <div className="space-y-2">
            {LAYERS.map(layer => {
              const isChecked = !!mapLayers[layer.key];
              return (
                <button
                  key={layer.key}
                  onClick={() => toggle(layer.key)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isChecked
                      ? 'bg-navy-50/80 dark:bg-navy-950/50 border-navy-200 dark:border-navy-800 text-navy-950 dark:text-white'
                      : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{layer.emoji}</span>
                    <span>{layer.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] opacity-75 font-normal">
                      ({layer.count})
                    </span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                        isChecked
                          ? 'bg-navy-700 border-navy-700 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check size={11} />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

