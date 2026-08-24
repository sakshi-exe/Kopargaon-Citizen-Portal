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
  Video, Play
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
      size="xl"
    >
      <div className="space-y-6">

        {/* 1. TOP HEADER: Infrastructure Details & QR Identification */}
        <div className="flex flex-col md:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-md">
          <div className="flex-shrink-0 bg-white p-2.5 rounded-xl shadow-inner text-center">
            <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${asset.id}`} size={110} />
            <div className="text-[10px] font-mono font-bold text-slate-800 mt-1">{asset.id}</div>
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {asset.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                {asset.type}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck size={14} /> Municipal Verified
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
              {asset.name}
            </h3>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-teal-400" /> {getWardName(asset.wardId)}
              </span>
              <span>·</span>
              <span>Kopargaon, Maharashtra</span>
              <span>·</span>
              <span>Last Inspected: <strong>{formatDate(asset.lastInspection)}</strong></span>
            </div>
          </div>

          <div className="text-center md:text-right flex-shrink-0">
            <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Condition Rating</div>
            <div
              className="text-3xl font-black"
              style={{ color: getConditionColor(asset.condition) }}
            >
              {asset.condition}<span className="text-lg text-slate-400">/10</span>
            </div>
            <div className="text-xs font-medium text-slate-300 mt-0.5">
              {asset.condition >= 8 ? 'Good / Operational' : asset.condition >= 5 ? 'Moderate Maintenance' : 'Poor / Intervention Required'}
            </div>
          </div>
        </div>

        {/* 2. PROJECT INFORMATION: "Know What Is Behind Your Infrastructure" */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Project Information & Public Audit
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Who Built It? (Contractor)</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 leading-snug">
                {asset.contractor || 'Kopargaon Municipal Council PWD'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Installation / Commission Date</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {formatDate(asset.installDate)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Project Cost / Budget</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {asset.budget ? formatCurrency(asset.budget) : '₹1.25 Cr (DPR Approved)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Field Inspector</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {asset.verifiedBy || 'Field Inspection Team'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Citizen Reports Logged</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${(asset.citizenReports || 0) > 10 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {asset.citizenReports || 0} citizen tickets
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Maintenance Lifecycle</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                <Badge variant={asset.maintenanceStatus === 'Up-to-date' ? 'green' : asset.maintenanceStatus === 'Due' ? 'amber' : 'red'}>
                  {asset.maintenanceStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Technical notes */}
        {asset.description && (
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-blue-900 dark:text-blue-200 block mb-1">Civic Asset Summary:</strong>
            {asset.description}
          </div>
        )}

        {/* 3. BEFORE / AFTER PHOTOS */}
        {transformation && (
          <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                <h5 className="text-sm font-bold text-teal-900 dark:text-teal-200">
                  Verified Transformation (BEFORE → AFTER)
                </h5>
              </div>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                {transformation.completedDate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800">
                <div className="relative h-36">
                  <img src={transformation.before.image} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 text-white shadow">
                    BEFORE (Condition: {transformation.before.condition})
                  </span>
                </div>
                <div className="p-2.5 text-xs text-slate-600 dark:text-slate-400">
                  {transformation.before.caption}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-800">
                <div className="relative h-36">
                  <img src={transformation.after.image} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow">
                    AFTER ({transformation.after.inspection})
                  </span>
                </div>
                <div className="p-2.5 text-xs text-slate-600 dark:text-slate-400">
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
              <Video size={16} className="text-teal-600 dark:text-teal-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Latest Project Video Evidence
              </h5>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> Verified On-Site Footage
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
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.date || item.year}:</span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1.5">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 font-mono">
            GEO: {asset.lat.toFixed(5)}, {asset.lng.toFixed(5)} · Kopargaon
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Download size={13} /> Print Asset QR Tag
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
