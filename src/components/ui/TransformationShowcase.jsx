import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { transformations } from '../../data/transformations.js';
import { getWardName } from '../../data/wards.js';
import { VideoEvidencePlayer } from './VideoEvidencePlayer.jsx';
import { QRCodeSVG } from './QRCodeView.jsx';
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck,
  QrCode, Clock, IndianRupee, Layers, Check, ExternalLink, HelpCircle,
  TrendingUp, CheckCircle, RefreshCw, Eye, ArrowLeftRight, ChevronRight
} from 'lucide-react';

export default function TransformationShowcase() {
  const { state, dispatch } = useApp();
  const [selectedId, setSelectedId] = useState('TRANS-01');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'slider' | 'animate'
  const [sliderPos, setSliderPos] = useState(50);
  const [animStage, setAnimStage] = useState(0); // 0: Problem (Before), 1: Intervention (In Progress), 2: Completed (After)
  const [isAnimating, setIsAnimating] = useState(false);

  const current = transformations.find(t => t.id === selectedId) || transformations[0];

  const handleOpenAssetQR = (assetId) => {
    const target = state.infrastructure.find(i => i.id === assetId) || {
      id: current.assetId,
      name: current.title,
      type: current.category,
      wardId: current.wardId,
      condition: current.after ? current.after.conditionScore : 9.5,
      installDate: current.startDate || '2026-06-12',
      lastInspection: current.completedDate || '2026-08-15',
      maintenanceStatus: 'Up-to-date',
      contractor: current.contractor,
      budget: 24500000,
      citizenReports: 23,
      description: current.story,
      maintenanceHistory: [
        { date: '2026-06-12', action: 'Issue reported & site inspection verified 18 potholes' },
        { date: '2026-06-25', action: 'Project approved with ₹2.45 Cr budget allocation' },
        { date: '2026-07-20', action: 'Dense bituminous macadam base completed' },
        { date: '2026-08-15', action: 'Final wearing course & thermoplastic lane marking verified' }
      ]
    };
    dispatch({ type: 'OPEN_ASSET_MODAL', payload: target });
  };

  // Smart Animate / Story Step Transition
  const triggerTransformationAnimation = () => {
    setViewMode('animate');
    setIsAnimating(true);
    setAnimStage(0); // Before
    setTimeout(() => {
      setAnimStage(1); // Intervention
    }, 1200);
    setTimeout(() => {
      setAnimStage(2); // Completed
      setIsAnimating(false);
    }, 2800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="p-6 sm:p-8 rounded-[30px] border border-[#F0C38B]/40 bg-gradient-to-br from-[#FFF8F2] via-white to-[#F3FBF4] shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative overflow-hidden tricolor-bar">
        <div className="absolute -left-16 top-4 h-36 w-36 rounded-full bg-[#FF9933]/12 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-[#138808]/12 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="civic-pill mb-3">
              <ShieldCheck size={14} /> KOPARGAON FIX · OFFICIAL CIVIC AUDIT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B1736] leading-tight">
              From Problem to Progress
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed max-w-2xl">
              See how Kopargaon Fix transformed the road with genuine municipal project documentation from citizen detection to field verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <button
              onClick={triggerTransformationAnimation}
              className="primary-btn px-5 py-3 text-xs sm:text-sm"
            >
              <RefreshCw size={16} className={isAnimating ? 'animate-spin' : ''} />
              View Project Transformation
            </button>
            <button
              onClick={() => handleOpenAssetQR(current.assetId)}
              className="secondary-btn px-4 py-3 text-xs sm:text-sm"
            >
              <QrCode size={16} /> Scan Asset QR ({current.assetId})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-5 border-t border-slate-200 scrollbar-thin">
          {transformations.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedId(t.id); setViewMode('split'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedId === t.id
                  ? 'bg-[#0B1736] text-white border-[#0B1736] shadow-md'
                  : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{t.category}</span>
              <span className="font-mono text-[10px] opacity-75">({t.assetId})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Centerpiece Comparison Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">

        {/* Header with View Mode Toggles & Subtle Arrow */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg">
              {current.assetId}
            </span>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400">BEFORE</span>
              <ArrowRight size={14} className="text-slate-400" />
              <span className="text-emerald-600 dark:text-emerald-400">AFTER</span>
            </div>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-900 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${viewMode === 'split' ? 'bg-slate-900 text-white dark:bg-teal-600 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${viewMode === 'slider' ? 'bg-slate-900 text-white dark:bg-teal-600 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Interactive Slider
            </button>
            <button
              onClick={triggerTransformationAnimation}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${viewMode === 'animate' ? 'bg-slate-900 text-white dark:bg-teal-600 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Smart Animate
            </button>
          </div>
        </div>

        {/* COMPARISON DISPLAY AREA */}
        <div className="p-6 bg-slate-100/70 dark:bg-slate-900/60">

          {/* VIEW 1: SIDE-BY-SIDE ON DESKTOP WITH VERTICAL DIVIDER */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">

              {/* LEFT: BEFORE OUR PROJECT */}
              <div className="flex flex-col rounded-2xl overflow-hidden border-2 border-red-200 dark:border-red-900/70 bg-white dark:bg-slate-800 shadow-md">
                <div className="p-4 border-b border-red-100 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                    <h3 className="font-extrabold text-sm text-red-950 dark:text-red-200 tracking-wide uppercase">
                      BEFORE OUR PROJECT
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                    Status: Poor Condition
                  </span>
                </div>

                {/* Road Image: Exact Uploaded First Image */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-900">
                  <img
                    src={current.before.image}
                    alt="Before Our Project Road Condition"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs font-bold border border-white/20 shadow">
                    ORIGINAL ROAD STATE
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-sm text-white text-xs">
                    <span className="font-bold text-red-300 block mb-0.5">Issues Logged:</span>
                    <span>{current.before.issues || 'Potholes • Waterlogging • Uneven Surface • Damaged Asphalt'}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs bg-red-50/30 dark:bg-red-950/10 flex-1">
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>18 Major Pothole Clusters:</strong> Deep craters causing vehicle damage & two-wheeler skidding.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Severe Waterlogging:</strong> Drainage failure causing road flooding during monsoon runoff.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>23 Citizen Complaints:</strong> High accident risk on Kopargaon Main Road.</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: AFTER OUR PROJECT */}
              <div className="flex flex-col rounded-2xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 shadow-md">
                <div className="p-4 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    <h3 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200 tracking-wide uppercase">
                      AFTER OUR PROJECT
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Status: Improved Condition
                  </span>
                </div>

                {/* Road Image: Exact Uploaded Second Image */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-900">
                  <img
                    src={current.after.image}
                    alt="After Our Project Completed Road Improvement"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold border border-white/20 shadow">
                    COMPLETED & INSPECTED
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-sm text-white text-xs">
                    <span className="font-bold text-emerald-300 block mb-0.5">Verified Project Evidence:</span>
                    <span>100% Resurfaced with Thermoplastic Markings & Certified Drainage Runoff</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs bg-emerald-50/30 dark:bg-emerald-950/10 flex-1">
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>✓ New Road Surface:</strong> High-grade heavy-duty bituminous wearing course.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>✓ Smooth Pavement & Proper Road Markings:</strong> Retro-reflective thermoplastic edge lines.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>✓ Improved Drainage & Safer for Traffic:</strong> Zero potholes and 66% travel time reduction.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: INTERACTIVE SLIDER */}
          {viewMode === 'slider' && (
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 aspect-[16/10] sm:h-[480px] shadow-lg select-none">
              {/* After Image (Background) */}
              <img
                src={current.after.image}
                alt="After Our Project"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg">
                AFTER OUR PROJECT (Improved Condition)
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-4 border-white shadow-2xl"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={current.before.image}
                  alt="Before Our Project"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ width: '100vw', maxWidth: 'none', minWidth: '100%' }}
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-extrabold shadow-lg">
                  BEFORE OUR PROJECT (Poor Condition)
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center shadow-2xl text-xs font-black">
                  ↔
                </div>
              </div>

              {/* Invisible Range Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>
          )}

          {/* VIEW 3: SMART ANIMATE / DISSOLVE STAGES */}
          {viewMode === 'animate' && (
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 aspect-[16/10] sm:h-[480px] shadow-lg bg-slate-950 flex flex-col justify-between p-6">
              {/* Image Transition (Smooth Dissolve) */}
              <img
                src={animStage === 0 ? current.before.image : current.after.image}
                alt="Transition Stage"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Stage Indicator Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                  {animStage === 0 && <span className="text-red-400">STAGE 1: PROBLEM DETECTION (BEFORE)</span>}
                  {animStage === 1 && <span className="text-amber-400 animate-pulse">STAGE 2: CIVIC INTERVENTION & RESURFACING</span>}
                  {animStage === 2 && <span className="text-emerald-400">STAGE 3: COMPLETED ROAD (AFTER OUR PROJECT)</span>}
                </div>
                <button
                  onClick={triggerTransformationAnimation}
                  className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1"
                >
                  <RefreshCw size={13} /> Replay
                </button>
              </div>

              {/* Progress Stage Flow */}
              <div className="relative z-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className={animStage === 0 ? 'text-red-400 font-extrabold' : 'text-slate-400'}>1. Problem Identified</span>
                  <ChevronRight size={14} className="text-slate-500" />
                  <span className={animStage === 1 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}>2. Engineering Work Executed</span>
                  <ChevronRight size={14} className="text-slate-500" />
                  <span className={animStage === 2 ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>3. Verified Field Improvement</span>
                </div>
                <div className="text-xs text-slate-300">
                  {animStage === 0 && "18 potholes and severe waterlogging reported by 23 citizens in Kopargaon."}
                  {animStage === 1 && "DPR ₹2.45 Cr approved. Sub-base stabilization, dense bituminous macadam & drainage casting."}
                  {animStage === 2 && "100% completed. Verified by Er. Sandeep Patil. Road certified smooth and safe for traffic."}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PROJECT INFORMATION & VERIFIED BADGES */}
        <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Info: Project Attributes & Verified Evidence (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    PROJECT DOCUMENTATION
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Main Road Improvement — Kopargaon
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                  <ShieldCheck size={16} className="text-emerald-500" /> Verified Project Evidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] font-semibold uppercase">Location</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Kopargaon, Maharashtra</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] font-semibold uppercase">Work Type</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Road Resurfacing & Improvement</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] font-semibold uppercase">Project Status</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">COMPLETED (100%)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] font-semibold uppercase">Contractor</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{current.contractor}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {current.story}
              </p>
            </div>

            {/* Right Info: QR Card for Complete Project History (4 cols) */}
            <div
              onClick={() => handleOpenAssetQR(current.assetId)}
              className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700 shadow-md cursor-pointer hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-teal-400 tracking-wider">
                    CIVICFIX QR SYSTEM
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {current.assetId}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white flex-shrink-0 shadow">
                    <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${current.assetId}`} size={64} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider leading-snug group-hover:text-teal-300 transition-colors">
                      SCAN QR FOR COMPLETE PROJECT HISTORY
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-tight">
                      Tap to open full background, DPR cost, contractor, Before/After audit, and citizen reports.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-700 flex items-center justify-between text-xs text-teal-400 font-bold">
                <span>View Full Infrastructure History</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* PROJECT JOURNEY TIMELINE (Connecting Before & After) */}
        <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock size={15} className="text-teal-500" /> Complete Project Journey & Timeline
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Kopargaon Main Road Resurfacing
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
            {[
              { step: '01', title: 'Issue Reported', desc: '23 citizen complaints', tag: 'BEFORE STATE', color: 'border-red-400 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40' },
              { step: '02', title: 'Site Inspection', desc: '18 potholes mapped', tag: 'Field Evidence', color: 'border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
              { step: '03', title: 'Project Approved', desc: '₹2.45 Cr DPR sanctioned', tag: 'KMC Sanctioned', color: 'border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },
              { step: '04', title: 'Road Work Started', desc: 'Subgrade stabilization', tag: 'Execution Phase', color: 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800' },
              { step: '05', title: 'Road Resurfacing', desc: '50mm dense DBM laid', tag: 'Asphalt Course', color: 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800' },
              { step: '06', title: 'Work Completed', desc: 'Thermoplastic markings', tag: '100% Delivered', color: 'border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
              { step: '07', title: 'Field Verification', desc: 'Er. Sandeep Patil certified', tag: 'AFTER STATE', color: 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 font-bold' },
            ].map((s) => (
              <div key={s.step} className={`p-3 rounded-2xl border ${s.color} flex flex-col justify-between shadow-sm`}>
                <div>
                  <div className="text-[10px] font-mono font-bold opacity-75">{s.step}</div>
                  <div className="text-xs font-bold leading-tight mt-0.5">{s.title}</div>
                  <div className="text-[10px] opacity-80 mt-1">{s.desc}</div>
                </div>
                <div className="text-[9px] font-extrabold uppercase mt-2 pt-1 border-t border-current/20">
                  {s.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED VIDEO EVIDENCE PLAYER */}
        <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <VideoEvidencePlayer
            title={`${current.title} — Verified On-Site Execution Video`}
            projectName={`${current.projectRef} · ${current.title}`}
            location={`${current.location}, Kopargaon, Maharashtra`}
            date="August 2026"
            verifiedBy={current.verifiedBy}
          />
        </div>

        {/* QUANTIFIABLE IMPACT METRICS */}
        <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Quantified Municipal Impact Metrics
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {current.metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">{m.label}</div>
                <div className="text-xs text-red-600 dark:text-red-400 line-through opacity-80 mb-0.5">
                  Before: {m.before}
                </div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check size={14} /> {m.after}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CLOSING STATEMENT (Verbatim Requirement) */}
        <div className="p-6 bg-slate-900 text-white border-t border-slate-800 text-center space-y-1">
          <p className="text-sm font-bold text-teal-400">
            "From a reported problem to a verified improvement."
          </p>
          <p className="text-xs text-slate-400 font-medium">
            "Kopargaon Fix — Making infrastructure visible, accountable and better."
          </p>
        </div>

      </div>

    </div>
  );
}
