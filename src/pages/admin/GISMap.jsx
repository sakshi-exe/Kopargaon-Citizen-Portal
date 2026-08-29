import React, { useState } from 'react';
import MapView from '../../components/map/MapView.jsx';
import LayerToggle from '../../components/map/LayerToggle.jsx';
import Header from '../../components/ui/Header.jsx';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { Search, ShieldCheck, MapPin, QrCode, AlertTriangle, Activity } from 'lucide-react';
import { getWardName } from '../../data/wards.js';
import { getConditionColor } from '../../data/infrastructure.js';

export default function AdminGISMap() {
  const { state, dispatch } = useApp();
  const analytics = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  const filteredAssets = searchQuery.trim()
    ? state.infrastructure.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectAsset = (asset) => {
    setSelectedResult(asset);
    setSearchQuery('');
    dispatch({ type: 'OPEN_ASSET_MODAL', payload: asset });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Geospatial Operations & GIS Command"
        subtitle="Kopargaon Urban Infrastructure Platform · Real-Time Layer Analysis & Spatial Assets"
      />

      {/* Operational Control Bar with Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 text-xs flex-shrink-0 z-20">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px] max-w-lg">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search road, ward, asset ID, or project..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 font-medium"
          />

          {filteredAssets.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-navy-700 dark:text-saffron-400 mr-2">{asset.id}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{asset.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{getWardName(asset.wardId)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Infra: <strong>{analytics.infrastructure.total}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-[11px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Projects: <strong>{analytics.projects.total}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-[11px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Delayed: <strong>{analytics.projects.delayedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Critical: <strong>{analytics.infrastructure.criticalCount}</strong></span>
          </div>
        </div>

      </div>

      {/* Full-Screen GIS Map Viewport */}
      <div className="flex-1 relative">
        <MapView
          height="100%"
          center={selectedResult ? [selectedResult.lat, selectedResult.lng] : undefined}
          zoom={selectedResult ? 16 : 14}
          className="absolute inset-0"
        />
        <LayerToggle />

        {/* Floating Municipal Infrastructure Legend */}
        <div className="absolute bottom-5 left-5 z-[400] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl p-4 text-xs max-w-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
              GIS Asset Health
            </span>
            <span className="text-[10px] text-navy-700 dark:text-saffron-400 font-bold">KOPARGAON</span>
          </div>

          <div className="space-y-1.5 font-medium">
            {[
              { color: '#138808', label: 'Good / Verified (8-10)' },
              { color: '#FF9933', label: 'Fair Maintenance (5-7)' },
              { color: '#ef4444', label: 'Critical Action (1-4)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-slate-600 dark:text-slate-400 text-[11px] font-semibold">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Click any map marker to view verified QR metadata, contractor, and public audit history.
          </div>
        </div>

      </div>
    </div>
  );
}

