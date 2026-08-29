import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { VideoEvidencePlayer, CompactVideoEvidenceCard } from '../../components/ui/VideoEvidencePlayer.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import {
  Search, MapPin, Calendar, IndianRupee, QrCode, ShieldCheck,
  Video, ArrowRight, CheckCircle2, Clock, Building
} from 'lucide-react';

export default function CitizenProjects() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = state.projects.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      (p.contractor && p.contractor.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ['All', 'In Progress', 'Completed', 'Delayed', 'Approved', 'Planned'];

  const handleOpenQRProfile = (p) => {
    setSelectedProject(null);
    const asset = state.infrastructure.find(i => i.id === p.qrAssetRef) || {
      id: p.id,
      name: p.name,
      type: p.category,
      wardId: p.wardId,
      condition: p.status === 'Completed' ? 9 : 6,
      installDate: p.startDate,
      lastInspection: p.expectedEnd,
      maintenanceStatus: p.status === 'Completed' ? 'Up-to-date' : 'Due',
      contractor: p.contractor,
      budget: p.budget,
      citizenReports: 0,
      description: p.description,
      maintenanceHistory: p.updates ? p.updates.map(u => ({ date: u.date, action: u.text })) : []
    };
    dispatch({ type: 'OPEN_ASSET_MODAL', payload: asset });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Development Projects"
        subtitle="Public monitoring of municipal engineering works, DPR allocations, and verified progress"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filters Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, contractor, or ID..."
              className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 font-medium"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === s
                    ? 'bg-navy-800 dark:bg-saffron-500 text-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="group bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 hover:shadow-lg hover:border-navy-400 dark:hover:border-navy-500 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded border border-navy-200 dark:border-navy-800">
                      {p.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mt-1.5 group-hover:text-navy-700 dark:group-hover:text-saffron-400 transition-colors">
                      {p.name}
                    </h3>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-navy-600 dark:text-saffron-400" /> {getWardName(p.wardId)} · Kopargaon
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee size={13} className="text-slate-400" /> Budget: <strong className="text-slate-900 dark:text-slate-200">{formatCurrency(p.budget)}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" /> Timeline: {formatDate(p.startDate)} → {formatDate(p.expectedEnd)}
                  </div>
                  {p.contractor && (
                    <div className="text-[11px] text-slate-500 pt-0.5 truncate">
                      Contractor: <strong className="text-slate-700 dark:text-slate-300">{p.contractor}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <ProgressBar value={p.progress} color="auto" size="sm" showLabel label="Execution Progress" />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2 font-medium">
                  {p.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-navy-700 dark:text-saffron-400 font-bold flex items-center gap-1">
                  <Video size={12} /> Video Evidence
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-navy-700 dark:group-hover:text-saffron-400">
                  View Details <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400 font-medium">
              No development projects match your search in Kopargaon.
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || "Project Details & Evidence"}
        subtitle="Official Kopargaon Municipal Council Project Information"
        size="xl"
      >
        {selectedProject && (
          <div className="space-y-6">

            {/* Top Project Summary Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white border border-navy-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-saffron-500/20 text-saffron-300 border border-saffron-400/30">
                    {selectedProject.id}
                  </span>
                  <StatusBadge status={selectedProject.status} />
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={13} /> KMC Verified Project
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{selectedProject.name}</h3>
                <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-2 font-medium">
                  <MapPin size={13} className="text-saffron-400" />
                  <span>{getWardName(selectedProject.wardId)}, Kopargaon, Maharashtra</span>
                </div>
              </div>

              <div className="text-left md:text-right flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Approved DPR Budget</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">{formatCurrency(selectedProject.budget)}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                  {getBudgetUtilization(selectedProject.spent, selectedProject.budget)}% Utilised
                </div>
              </div>
            </div>

            {/* Project Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Department</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{selectedProject.department}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Contractor</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{selectedProject.contractor || 'KMC PWD'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Commencement</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(selectedProject.startDate)}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Completion</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(selectedProject.expectedEnd)}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Execution & Delivery Progress</span>
                <span>{selectedProject.progress}% Completed</span>
              </div>
              <ProgressBar value={selectedProject.progress} color="auto" size="md" />
            </div>

            {/* Core Video Evidence Player */}
            <div>
              <VideoEvidencePlayer
                title={`${selectedProject.name} — Progress & Verification Audit`}
                projectName={selectedProject.name}
                location={`Kopargaon (${getWardName(selectedProject.wardId)}), Maharashtra`}
                date="August 2026"
                verifiedBy={selectedProject.contractor ? `Audited by KMC Inspection Cell · Contractor: ${selectedProject.contractor}` : "KMC Quality Audit Division"}
              />
            </div>

            {/* Project Updates Log */}
            {selectedProject.updates && selectedProject.updates.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Clock size={14} /> Chronological Project Execution Updates
                </h4>
                <div className="space-y-3 border-l-2 border-slate-200 dark:border-slate-700 ml-2 pl-4">
                  {selectedProject.updates.map((u, i) => (
                    <div key={i} className="relative text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-navy-600 dark:bg-saffron-400 absolute -left-[21px] top-1" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(u.date)}:</span>
                      <span className="text-slate-600 dark:text-slate-400 ml-1.5 font-medium">{u.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleOpenQRProfile(selectedProject)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition-colors"
              >
                <QrCode size={14} /> View Associated QR Asset Profile
              </button>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}

