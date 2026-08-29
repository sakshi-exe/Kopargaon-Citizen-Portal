import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { QRCodeSVG } from '../../components/ui/QRCodeView.jsx';
import { getWardName } from '../../data/wards.js';
import { getConditionColor } from '../../data/infrastructure.js';
import {
  QrCode, Camera, Search, ShieldCheck, CheckCircle2, ArrowRight,
  Sparkles, Layers, Eye, Smartphone, AlertCircle
} from 'lucide-react';

export default function QRScanner() {
  const { state, dispatch } = useApp();
  const [assetIdInput, setAssetIdInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanSimulation = (id) => {
    setScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      setScanning(false);
      const target = state.infrastructure.find(
        i => i.id.toLowerCase() === (id || assetIdInput).trim().toLowerCase()
      );
      if (target) {
        dispatch({ type: 'OPEN_ASSET_MODAL', payload: target });
      } else {
        setErrorMsg(`Asset ID "${id || assetIdInput}" not found in Kopargaon registry.`);
      }
    }, 650);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="CivicFix QR Infrastructure Scanner"
        subtitle="Scan or search any civic infrastructure tag in Kopargaon for verified public audit data"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">

        {/* Hero Scanner Viewfinder Box */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Tricolour Accent Line */}
          <div className="civic-tricolour-stripe absolute top-0 left-0 right-0" />

          <div className="text-center max-w-lg mx-auto pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-mono font-bold mb-3 border border-saffron-400/30">
              <ShieldCheck size={14} /> KOPARGAON CIVIC TRANSPARENCY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Scan CivicFix QR Tag
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">
              Scan the QR code attached to civic infrastructure (roads, bridges, lights, drains, water tanks) to view its verified background, contractor, budget, inspection status, and maintenance history.
            </p>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 rounded-2xl border-2 border-saffron-500/50 bg-slate-950/80 flex flex-col items-center justify-center p-4 shadow-inner overflow-hidden">

              {/* Corner reticle markers */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-saffron-400 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-saffron-400 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-saffron-400 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-saffron-400 rounded-br-lg" />

              {/* Laser animation beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-saffron-400 to-transparent animate-pulse shadow-[0_0_15px_#fb923c]" />

              <Camera size={44} className="text-saffron-400/60 mb-2" />
              <span className="text-xs text-slate-400 text-center font-medium">
                {scanning ? 'Decoding QR Signature...' : 'Align camera with CivicFix QR tag'}
              </span>

              {scanning && (
                <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-saffron-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Quick manual Asset ID Search Bar */}
            <div className="w-full max-w-md mt-6 flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={assetIdInput}
                  onChange={(e) => setAssetIdInput(e.target.value)}
                  placeholder="Enter Asset ID (e.g. ROAD-KPG-1028)..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleScanSimulation()}
                />
              </div>
              <button
                onClick={() => handleScanSimulation()}
                disabled={!assetIdInput.trim() || scanning}
                className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                Scan
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 text-xs text-red-400 flex items-center gap-1.5 font-semibold">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Demo Scannable QR Asset Directory */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Sample Kopargaon QR Tags (Click any to simulate instant scan)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each civic infrastructure asset in Kopargaon carries an authoritative CivicFix QR code tag.
              </p>
            </div>
            <span className="text-xs font-bold text-navy-700 dark:text-saffron-400 font-mono">
              {state.infrastructure.length} Registered Assets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {state.infrastructure.map((item) => (
              <div
                key={item.id}
                onClick={() => handleScanSimulation(item.id)}
                className="group p-3.5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 hover:border-navy-400 dark:hover:border-navy-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${item.id}`} size={54} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.id}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${getConditionColor(item.condition)}20`,
                        color: getConditionColor(item.condition)
                      }}
                    >
                      {item.condition}/10
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.name}
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                    {item.type} · {getWardName(item.wardId)}
                  </div>
                </div>

                <ArrowRight size={14} className="text-slate-400 group-hover:text-navy-700 dark:group-hover:text-saffron-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

