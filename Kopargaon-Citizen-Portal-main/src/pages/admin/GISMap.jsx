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
        title="CivicFix — Kopargaon GIS Command Centre"
        subtitle="Kopargaon Urban Infrastructure Platform · Geospatial Asset & Project Operations"
      />

      {/* Operational Control Bar with Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs flex-shrink-0">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[300px] max-w-lg">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search road, ward, infrastructure or project..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />

          {filteredAssets.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mr-2">{asset.id}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{getWardName(asset.wardId)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-5 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Infrastructure: <strong className="text-slate-900 dark:text-white">{analytics.infrastructure.total}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Projects: <strong className="text-slate-900 dark:text-white">{analytics.projects.total}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Delayed: <strong className="text-red-600 dark:text-red-400">{analytics.projects.delayedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Critical Assets: <strong className="text-amber-600 dark:text-amber-400">{analytics.infrastructure.criticalCount}</strong></span>
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

        {/* Floating Municipal Infrastructure Legend & Quick QR audit card */}
        <div className="absolute bottom-5 left-5 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 text-xs max-w-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              GIS Asset Health
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">KOPARGAON</span>
          </div>

          <div className="space-y-1.5">
            {[
              { color: '#22c55e', label: 'Good / Verified (8-10)' },
              { color: '#f59e0b', label: 'Fair Maintenance (5-7)' },
              { color: '#ef4444', label: 'Poor / Critical Action (1-4)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
            💡 Click any map marker to view its verified QR profile, contractor, and public audit history.
          </div>
        </div>

      </div>
    </div>
  );
}
