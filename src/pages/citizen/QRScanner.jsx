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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-[#F0C38B]/40 bg-gradient-to-br from-[#FFF8F2] via-white to-[#F3FBF4] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8 relative overflow-hidden">
          <div className="absolute -left-16 top-4 h-40 w-40 rounded-full bg-[#FF9933]/12 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-[#138808]/12 blur-3xl" />

          <div className="relative">
            <div className="text-center max-w-2xl mx-auto">
              <div className="civic-pill mx-auto mb-4">
                <ShieldCheck size={14} /> KOPARGAON CIVIC TRANSPARENCY
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1736]">
                Scan CivicFix QR Tag
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Scan the QR code attached to civic infrastructure to view verified background, budget, inspection status, and maintenance history.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 rounded-[28px] border border-[#138808]/20 bg-white/90 flex flex-col items-center justify-center p-4 shadow-[0_18px_32px_rgba(11,23,54,0.08)] overflow-hidden">
                <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-[#FF9933] rounded-tl-xl" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-[#138808] rounded-tr-xl" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-[#138808] rounded-bl-xl" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-[#FF9933] rounded-br-xl" />
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF9933] to-transparent animate-pulse" />

                <Camera size={44} className="text-[#0B1736]/60 mb-2" />
                <span className="text-xs text-slate-600 text-center font-medium">
                  {scanning ? 'Decoding QR Signature...' : 'Align camera with CivicFix QR tag'}
                </span>

                {scanning && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-8 h-8 border-3 border-[#138808] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="w-full max-w-md mt-6 flex gap-2">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={assetIdInput}
                    onChange={(e) => setAssetIdInput(e.target.value)}
                    placeholder="Enter Asset ID (e.g. ROAD-KPG-1028)..."
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/40 font-mono shadow-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleScanSimulation()}
                  />
                </div>
                <button
                  onClick={() => handleScanSimulation()}
                  disabled={!assetIdInput.trim() || scanning}
                  className="primary-btn px-5 py-2.5 disabled:opacity-60"
                >
                  Scan
                </button>
              </div>

              {errorMsg && (
                <div className="mt-3 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Scannable QR Asset Directory */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Sample Kopargaon QR Tags (Click any to simulate instant scan)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each civic infrastructure asset in Kopargaon carries an authoritative CivicFix QR code tag.
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              {state.infrastructure.length} Registered Assets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {state.infrastructure.map((item) => (
              <div
                key={item.id}
                onClick={() => handleScanSimulation(item.id)}
                className="group p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${item.id}`} size={54} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.id}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${getConditionColor(item.condition)}20`,
                        color: getConditionColor(item.condition)
                      }}
                    >
                      {item.condition}/10
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {item.name}
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.type} · {getWardName(item.wardId)}
                  </div>
                </div>

                <ArrowRight size={14} className="text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
