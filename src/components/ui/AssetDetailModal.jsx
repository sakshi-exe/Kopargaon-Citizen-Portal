import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Modal } from './Modal.jsx';
import { Badge, ConditionBadge, StatusBadge } from './Badge.jsx';
import { QRCodeSVG } from './QRCodeView.jsx';
import { CompactVideoEvidenceCard, VideoEvidencePlayer } from './VideoEvidencePlayer.jsx';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { getConditionColor } from '../../data/infrastructure.js';
import {
  QrCode, ShieldCheck, MapPin, Building, Calendar, IndianRupee,
  Wrench, AlertTriangle, CheckCircle, FileText, Download, ExternalLink,
  Video, Play, CheckCircle2
} from 'lucide-react';

export default function AssetDetailModal() {
  const { state, dispatch } = useApp();
  const [showFullVideoPlayer, setShowFullVideoPlayer] = useState(false);
  const asset = state.selectedAsset;

  if (!asset) return null;

  const handleClose = () => {
    setShowFullVideoPlayer(false);
    dispatch({ type: 'CLOSE_ASSET_MODAL' });
  };

  // Find linked transformation if any
  const transformation = state.transformations.find(
    t => t.assetId === asset.id || t.id === asset.beforeAfterRef
  );

  // Find related project if any
  const relatedProject = asset.relatedProjects && asset.relatedProjects.length > 0
    ? state.projects.find(p => p.id === asset.relatedProjects[0])
    : null;

  return (
    <Modal
      isOpen={!!asset}
      onClose={handleClose}
      title="CivicFix Verified Infrastructure Profile"
      subtitle="Official Kopargaon Municipal Council Public Asset Record"
      size="xl"
    >
      <div className="space-y-6">

        {/* 1. TOP HEADER: Infrastructure Details & QR Identification */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white border border-navy-800 shadow-md">
          <div className="flex-shrink-0 bg-white p-2.5 rounded-2xl shadow-md text-center border border-slate-200">
            <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${asset.id}`} size={110} />
            <div className="text-[10px] font-mono font-bold text-slate-800 mt-1">{asset.id}</div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-saffron-500/20 text-saffron-300 border border-saffron-400/30">
                {asset.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {asset.type}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                <ShieldCheck size={14} /> Municipal Verified
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {asset.name}
            </h3>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2.5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-saffron-400" /> {getWardName(asset.wardId)}
              </span>
              <span>·</span>
              <span>Kopargaon, Maharashtra</span>
              <span>·</span>
              <span>Last Inspected: <strong>{formatDate(asset.lastInspection)}</strong></span>
            </div>
          </div>

          <div className="text-center sm:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Condition Rating</div>
            <div
              className="text-3xl sm:text-4xl font-black mt-0.5"
              style={{ color: getConditionColor(asset.condition) }}
            >
              {asset.condition}<span className="text-lg text-slate-400 font-normal">/10</span>
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">
              {asset.condition >= 8 ? 'Operational / Good' : asset.condition >= 5 ? 'Fair Condition' : 'Intervention Needed'}
            </div>
          </div>
        </div>

        {/* 2. PROJECT INFORMATION: "Know What Is Behind Your Infrastructure" */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-navy-600 dark:text-navy-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Project Information & Public Audit
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Who Built It? (Contractor)</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5 leading-snug">
                {asset.contractor || 'Kopargaon Municipal Council PWD'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Installation / Commission Date</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5">
                {formatDate(asset.installDate)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Project Cost / DPR Budget</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5">
                {asset.budget ? formatCurrency(asset.budget) : '₹1.25 Cr (DPR Approved)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified Field Inspector</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5">
                {asset.verifiedBy || 'Field Inspection Team'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Citizen Reports Logged</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${(asset.citizenReports || 0) > 10 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {asset.citizenReports || 0} citizen tickets
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Maintenance Lifecycle</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mt-0.5">
                <Badge variant={asset.maintenanceStatus === 'Up-to-date' ? 'green' : asset.maintenanceStatus === 'Due' ? 'amber' : 'red'}>
                  {asset.maintenanceStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Technical notes */}
        {asset.description && (
          <div className="p-4 rounded-xl bg-navy-50/60 dark:bg-navy-950/30 border border-navy-200/60 dark:border-navy-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-navy-900 dark:text-navy-200 block mb-1">Civic Asset Summary:</strong>
            {asset.description}
          </div>
        )}

        {/* 3. BEFORE / AFTER PHOTOS */}
        {transformation && (
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Verified Transformation (BEFORE → AFTER)
                </h5>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Completed: {transformation.completedDate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border-2 border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-800 shadow-xs">
                <div className="relative h-36 bg-slate-900">
                  <img src={transformation.before.image} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-red-600 text-white shadow">
                    BEFORE (Condition: {transformation.before.condition})
                  </span>
                </div>
                <div className="p-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {transformation.before.caption}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 shadow-xs">
                <div className="relative h-36 bg-slate-900">
                  <img src={transformation.after.image} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-600 text-white shadow">
                    AFTER ({transformation.after.inspection})
                  </span>
                </div>
                <div className="p-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {transformation.after.caption}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. LATEST VIDEO EVIDENCE SECTION */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video size={16} className="text-navy-600 dark:text-navy-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Latest Project Video Evidence
              </h5>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> Verified On-Site Footage
            </span>
          </div>

          {showFullVideoPlayer ? (
            <VideoEvidencePlayer
              title={`${asset.name} — Execution & Inspection Audit`}
              projectName={relatedProject ? relatedProject.name : `${asset.name} Infrastructure Improvement`}
              location={`Kopargaon (${getWardName(asset.wardId)}), Maharashtra`}
              date="August 2026"
              verifiedBy={asset.verifiedBy || "Field Inspection Team"}
            />
          ) : (
            <CompactVideoEvidenceCard
              title={`${asset.name} — Progress Verification`}
              projectName={relatedProject ? relatedProject.name : asset.name}
              date="August 2026"
              onOpenFullPlayer={() => setShowFullVideoPlayer(true)}
            />
          )}
        </div>

        {/* 5. INSPECTION & MAINTENANCE HISTORY */}
        {asset.maintenanceHistory && asset.maintenanceHistory.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Wrench size={14} /> Inspection & Maintenance Audit History
            </h5>
            <div className="space-y-2.5 border-l-2 border-slate-200 dark:border-slate-700 ml-2 pl-4">
              {asset.maintenanceHistory.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-navy-600 dark:bg-navy-400 absolute -left-[21px] top-1" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.date || item.year}:</span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1.5">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-mono">
            GEO: {asset.lat.toFixed(5)}, {asset.lng.toFixed(5)} · Kopargaon
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download size={13} /> Print Asset QR Tag
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

