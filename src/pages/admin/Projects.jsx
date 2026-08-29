import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { VideoEvidencePlayer } from '../../components/ui/VideoEvidencePlayer.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { PROJECT_STATUSES, PROJECT_CATEGORIES, DEPARTMENTS, getStatusDot } from '../../data/projects.js';
import { wards } from '../../data/wards.js';
import { Search, Calendar, AlertTriangle, IndianRupee, QrCode, Video, ShieldCheck } from 'lucide-react';

export default function AdminProjects() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWard, setFilterWard] = useState('All');
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  const filtered = state.projects.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.contractor && p.contractor.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchWard = filterWard === 'All' || p.wardId === filterWard;
    return matchSearch && matchStatus && matchWard;
  });

  const startEdit = (p) => {
    setEditForm({ status: p.status, progress: p.progress });
    setEditMode(true);
  };

  const saveEdit = () => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { projectId: selected.id, updates: editForm } });
    setSelected(s => ({ ...s, ...editForm }));
    setEditMode(false);
  };

  const delayedCount = state.projects.filter(p => p.status === 'Delayed').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Project Monitoring & Verification"
        subtitle={`${filtered.length} projects · ${delayedCount} delayed in Kopargaon wards`}
      />

      {delayedCount > 0 && (
        <div className="px-6 py-2.5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-semibold">
          <AlertTriangle size={15} />
          <strong>{delayedCount}</strong> project(s) currently marked as Delayed. Immediate contractor review & resource reallocation recommended.
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-3 flex-shrink-0">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects by name, contractor, or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
        >
          <option value="All">All Statuses</option>
          {PROJECT_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterWard}
          onChange={e => setFilterWard(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
        >
          <option value="All">All Kopargaon Wards</option>
          {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs min-w-[950px]">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              {['Project ID', 'Project Title', 'Ward / Area', 'Category', 'Contractor', 'Budget & DPR', 'Progress', 'Status', 'Evidence & Action'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map(p => (
              <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${p.status === 'Delayed' ? 'bg-red-50/20 dark:bg-red-900/10' : ''}`}>
                <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{p.id}</td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-slate-200 max-w-[220px] leading-snug">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.department}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">{getWardName(p.wardId)}</td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3.5 max-w-[140px] truncate text-slate-700 dark:text-slate-300">{p.contractor || 'KMC PWD'}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="text-slate-800 dark:text-slate-200 font-bold">{formatCurrency(p.budget)}</div>
                  <div className="text-[10px] text-slate-400">{getBudgetUtilization(p.spent, p.budget)}% utilised</div>
                </td>
                <td className="px-4 py-3.5 w-28">
                  <ProgressBar value={p.progress} color="auto" size="sm" showLabel />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelected(p); setEditMode(false); }}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      <Video size={12} /> Audit & Evidence
                    </button>
                    <button
                      onClick={() => { setSelected(p); startEdit(p); }}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Detail & Evidence modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setEditMode(false); }} title={selected?.name || 'Project Details'} size="xl">
        {selected && !editMode && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['Project ID', selected.id],
                ['Category', selected.category],
                ['Ward / Location', `${getWardName(selected.wardId)}, Kopargaon`],
                ['Contractor', selected.contractor || 'KMC Engineering Div'],
                ['Approved Budget', formatCurrency(selected.budget)],
                ['Expenditure', formatCurrency(selected.spent)],
                ['Start Date', formatDate(selected.startDate)],
                ['Target End Date', formatDate(selected.expectedEnd)],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{k}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Execution Delivery Progress</span>
                <span>{selected.progress}% Completed</span>
              </div>
              <ProgressBar value={selected.progress} color="auto" size="md" />
            </div>

            <div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                {selected.description}
              </p>
            </div>

            {/* VIDEO EVIDENCE PLAYER IN MODAL */}
            <div>
              <VideoEvidencePlayer
                title={`${selected.name} — Progress Evidence Audit`}
                projectName={selected.name}
                location={`Kopargaon (${getWardName(selected.wardId)}), Maharashtra`}
                date="August 2026"
                verifiedBy={selected.contractor ? `Audited for KMC by Field Inspection Cell · Contractor: ${selected.contractor}` : "KMC Quality Audit Division"}
              />
            </div>

            {selected.updates && selected.updates.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Chronological Site Log Updates
                </h4>
                <div className="space-y-3 border-l-2 border-slate-200 dark:border-slate-700 ml-2 pl-4">
                  {selected.updates.map((u, i) => (
                    <div key={i} className="relative text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                      <div className="text-[10px] text-slate-400 mb-0.5">{formatDate(u.date)}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">{u.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => startEdit(selected)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Update Project Status & Progress
              </button>

              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selected && editMode && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Project Status</label>
              <select
                value={editForm.status}
                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium"
              >
                {PROJECT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Execution Progress ({editForm.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editForm.progress}
                onChange={e => setEditForm(f => ({ ...f, progress: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={saveEdit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">Save Changes</button>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
