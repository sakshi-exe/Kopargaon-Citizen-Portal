import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { QRCodeSVG } from '../../components/ui/QRCodeView.jsx';
import { CompactVideoEvidenceCard } from '../../components/ui/VideoEvidencePlayer.jsx';
import { formatDate } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { getConditionColor } from '../../data/infrastructure.js';
import {
  Wrench, Camera, CheckCircle2, QrCode, Search, Upload,
  AlertTriangle, ShieldCheck, Clock, FileText, ArrowRight, UserCheck
} from 'lucide-react';

export default function FieldInspection() {
  const { state, dispatch } = useApp();
  const [selectedAssetId, setSelectedAssetId] = useState('ROAD-KPG-1028');
  const [inspectorName, setInspectorName] = useState('Er. Sandeep Patil (Junior Engineer)');
  const [conditionLevel, setConditionLevel] = useState('Poor');
  const [conditionScore, setConditionScore] = useState(3);
  const [remarks, setRemarks] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [successBanner, setSuccessBanner] = useState(false);

  const selectedAsset = state.infrastructure.find(i => i.id === selectedAssetId) || state.infrastructure[0];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAsset) return;

    dispatch({
      type: 'SUBMIT_INSPECTION',
      payload: {
        assetId: selectedAsset.id,
        inspectorName,
        condition: conditionLevel,
        conditionScore: Number(conditionScore),
        remarks: remarks || `Routine municipal audit performed for ${selectedAsset.name}. Condition verified on-site.`,
        evidencePhoto: photoPreview || 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
      }
    });

    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 5000);
    setRemarks('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Field Inspection & Quality Audit Cell"
        subtitle="On-site municipal engineer console — log condition ratings, geo-tagged photos, and certified audits"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {successBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="block text-sm font-bold">Field Inspection Certified & Recorded into KMC Registry!</strong>
                <span className="text-xs font-medium">Asset {selectedAssetId} condition score updated in GIS Command Center and public transparency record.</span>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'OPEN_ASSET_MODAL', payload: selectedAsset })}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
            >
              View Updated QR Profile
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Inspection Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench size={18} className="text-navy-600 dark:text-saffron-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Record On-Site Asset Inspection
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Step 1: Select or Scan Asset ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  1. Target Infrastructure Asset <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  {state.infrastructure.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} — {item.name} ({getWardName(item.wardId)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Inspector Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    2. Inspector Name / Designation
                  </label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
                    placeholder="Inspector name..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Ward / Sector
                  </label>
                  <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {getWardName(selectedAsset.wardId)}
                  </div>
                </div>
              </div>

              {/* Step 3: Condition Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                  3. Assessed Condition Rating
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Good', score: 8, color: 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
                    { label: 'Moderate', score: 6, color: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' },
                    { label: 'Poor', score: 4, color: 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
                    { label: 'Critical', score: 2, color: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.label}
                      onClick={() => {
                        setConditionLevel(c.label);
                        setConditionScore(c.score);
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        conditionLevel === c.label
                          ? `${c.color} font-bold shadow-xs`
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5 font-semibold">{c.score} / 10</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Photo / Evidence Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  4. Photographic Field Evidence
                </label>
                {photoPreview ? (
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={photoPreview} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold hover:bg-black"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-navy-500 dark:hover:border-navy-400 transition-colors bg-slate-50/50 dark:bg-slate-900/40">
                    <Camera size={22} className="text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Click to upload geo-tagged field photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, HEIC up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
                  </label>
                )}
              </div>

              {/* Step 5: Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  5. Technical Findings & Action Recommended
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record observed structural damage, wear and tear, maintenance requirements..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none font-medium"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-saffron-500 hover:bg-saffron-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} /> Certify & Submit Field Inspection
                </button>
              </div>
            </form>
          </div>

          {/* Right: Selected Asset Preview & History (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Asset Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded border border-navy-200 dark:border-navy-800">
                    {selectedAsset.id}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-1.5 leading-snug">
                    {selectedAsset.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {selectedAsset.type} · {getWardName(selectedAsset.wardId)}
                  </div>
                </div>

                <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                  <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${selectedAsset.id}`} size={60} />
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Rating:</span>
                  <span className="font-bold" style={{ color: getConditionColor(selectedAsset.condition) }}>
                    {selectedAsset.condition}/10 ({selectedAsset.condition >= 7 ? 'Good' : selectedAsset.condition >= 5 ? 'Moderate' : 'Poor'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Inspection:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(selectedAsset.lastInspection)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractor:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedAsset.contractor || 'KMC PWD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Citizen Complaints:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedAsset.citizenReports || 0} tickets</span>
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: 'OPEN_ASSET_MODAL', payload: selectedAsset })}
                className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <QrCode size={13} className="text-navy-700 dark:text-saffron-400" /> View Full Public History Profile
              </button>
            </div>

            {/* Latest Video Progress Evidence */}
            <CompactVideoEvidenceCard
              title={`${selectedAsset.name} — Progress Verification`}
              projectName={selectedAsset.name}
              date="August 2026"
            />

            {/* Recent Inspection Logs */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock size={14} /> Recent Field Inspection Audit Logs
              </h4>

              <div className="space-y-3">
                {state.inspections.map((insp) => (
                  <div key={insp.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="font-mono text-navy-700 dark:text-saffron-400 font-bold">{insp.assetId}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(insp.date)}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>{insp.inspectorName}</strong> logged condition <strong>{insp.conditionLabel || insp.condition} ({insp.condition}/10)</strong>
                    </div>
                    {insp.remarks && (
                      <p className="text-slate-500 dark:text-slate-400 italic">"{insp.remarks}"</p>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                      <ShieldCheck size={12} /> {insp.status || 'Verified'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

