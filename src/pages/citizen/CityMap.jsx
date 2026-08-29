import React, { useState } from 'react';
import MapView from '../../components/map/MapView.jsx';
import { KOPARGAON_CENTER } from '../../data/wards.js';
import LayerToggle from '../../components/map/LayerToggle.jsx';
import Header from '../../components/ui/Header.jsx';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import {
  Search,
  MapPin,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function CitizenCityMap() {
  const { state, dispatch } = useApp();
  const analytics = useAnalytics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  // Filter infrastructure or projects by search
  const filteredAssets = searchQuery.trim()
    ? state.infrastructure.filter(
        (i) =>
          i.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          i.id
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          i.type
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectAsset = (asset) => {
    setSelectedResult(asset);
    setSearchQuery('');

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload: asset,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* =========================================================
          HEADER
      ========================================================== */}
      <Header
        title="Kopargaon GIS City Map"
        subtitle="Live geospatial infrastructure layer, active projects, and citizen feedback"
      />


      {/* =========================================================
          MAP SEARCH & FILTER BAR
      ========================================================== */}
      <div
        className="
          px-6
          py-3
          bg-white
          border-b border-slate-200
          flex
          flex-wrap
          items-center
          gap-4
          flex-shrink-0
        "
      >

        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">

          <Search
            size={15}
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-slate-400
              pointer-events-none
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search road, ward, infrastructure or project..."
            className="
              w-full
              pl-9
              pr-3
              py-2
              bg-slate-50
              border border-slate-200
              rounded-xl
              text-xs
              text-slate-900
              placeholder-slate-400
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500/30
              focus:border-teal-400
              font-medium
              transition-all
            "
          />


          {/* =====================================================
              SEARCH DROPDOWN
          ====================================================== */}
          {filteredAssets.length > 0 && (

            <div
              className="
                absolute
                top-full
                left-0
                right-0
                mt-2
                bg-white
                rounded-xl
                border border-slate-200
                shadow-xl
                z-50
                max-h-60
                overflow-y-auto
                divide-y
                divide-slate-100
              "
            >

              {filteredAssets.map((asset) => (

                <div
                  key={asset.id}
                  onClick={() =>
                    handleSelectAsset(asset)
                  }
                  className="
                    p-3
                    hover:bg-slate-50
                    cursor-pointer
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-xs
                    transition-colors
                  "
                >

                  <div className="min-w-0">

                    <span
                      className="
                        font-mono
                        font-bold
                        text-blue-600
                        mr-2
                      "
                    >
                      {asset.id}
                    </span>

                    <span
                      className="
                        font-semibold
                        text-slate-800
                      "
                    >
                      {asset.name}
                    </span>

                  </div>

                  <span
                    className="
                      text-[10px]
                      text-slate-400
                      font-medium
                      whitespace-nowrap
                    "
                  >
                    {asset.type}
                  </span>

                </div>

              ))}

            </div>
          )}

        </div>


        {/* =========================================================
            LIVE LAYER STATISTICS
        ========================================================== */}
        <div
          className="
            flex
            items-center
            gap-4
            text-xs
            text-slate-600
            overflow-x-auto
          "
        >

          {/* Infrastructure */}
          <div
            className="
              flex
              items-center
              gap-1.5
              whitespace-nowrap
              px-2.5
              py-1.5
              rounded-lg
              bg-emerald-50
              border border-emerald-100
            "
          >

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-emerald-500
              "
            />

            <span>
              Infrastructure (
              <strong className="text-slate-800">
                {analytics.infrastructure.total}
              </strong>
              )
            </span>

          </div>


          {/* Projects */}
          <div
            className="
              flex
              items-center
              gap-1.5
              whitespace-nowrap
              px-2.5
              py-1.5
              rounded-lg
              bg-blue-50
              border border-blue-100
            "
          >

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-blue-500
              "
            />

            <span>
              Projects (
              <strong className="text-slate-800">
                {analytics.projects.total}
              </strong>
              )
            </span>

          </div>


          {/* Citizen Tickets */}
          <div
            className="
              flex
              items-center
              gap-1.5
              whitespace-nowrap
              px-2.5
              py-1.5
              rounded-lg
              bg-red-50
              border border-red-100
            "
          >

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-red-500
              "
            />

            <span>
              Citizen Tickets (
              <strong className="text-slate-800">
                {analytics.issues.total}
              </strong>
              )
            </span>

          </div>

        </div>

      </div>


      {/* =========================================================
          FULL GIS MAP VIEWPORT
      ========================================================== */}
      <div className="flex-1 relative bg-slate-100">

        <MapView
          height="100%"
          center={
            selectedResult
              ? [
                  selectedResult.lat,
                  selectedResult.lng,
                ]
              : undefined
          }
          zoom={selectedResult ? 16 : 14}
          className="absolute inset-0"
        />

        <LayerToggle />

      </div>

    </div>
  );
}