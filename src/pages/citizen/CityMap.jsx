import React, { useState } from 'react';
import MapView from '../../components/map/MapView.jsx';
import { KOPARGAON_CENTER } from '../../data/wards.js';
import LayerToggle from '../../components/map/LayerToggle.jsx';
import Header from '../../components/ui/Header.jsx';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { Search, MapPin, QrCode, ShieldCheck } from 'lucide-react';

export default function CitizenCityMap() {
  const { state, dispatch } = useApp();
  const analytics = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  // Filter infrastructure or projects by search
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
        title="Kopargaon GIS City Map"
        subtitle="Live geospatial infrastructure layer, active projects, and citizen feedback"
      />

      {/* Map Search & Filter Bar */}
      <div className="px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 flex-shrink-0">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search road, ward, infrastructure or project..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />

          {/* Search Dropdown Results */}
          {filteredAssets.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
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
                  <span className="text-[10px] text-slate-400 font-medium">{asset.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Layer Statistics Pills */}
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Infrastructure (<strong>{analytics.infrastructure.total}</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Projects (<strong>{analytics.projects.total}</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Citizen Tickets (<strong>{analytics.issues.total}</strong>)</span>
          </div>
        </div>
      </div>

      {/* Full GIS Map Viewport */}
      <div className="flex-1 relative">
        <MapView
          height="100%"
          center={selectedResult ? [selectedResult.lat, selectedResult.lng] : undefined}
          zoom={selectedResult ? 16 : 14}
          className="absolute inset-0"
        />
        <LayerToggle />
      </div>
    </div>
  );
}
