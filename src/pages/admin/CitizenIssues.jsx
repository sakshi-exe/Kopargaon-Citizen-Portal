import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { getWardName } from '../../data/wards.js';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, STATUS_FLOW } from '../../data/issues.js';
import { wards } from '../../data/wards.js';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { Search, MapPin, Clock, CheckCircle, ShieldCheck, QrCode, Image, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

const DEPARTMENTS = [
  'Road Maintenance & PWD',
  'Water Supply & Sanitation',
  'Stormwater Drainage Division',
  'Electrical & Street Lighting',
  'Solid Waste & Sanitation',
  'Town Planning & Development',
];

export default function AdminCitizenIssues() {
  const { state, updateReportStatus, refreshLiveData } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWard, setFilterWard] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [selected, setSelected] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const filtered = state.issues.filter(i => {
    const matchSearch = !search ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      (i.citizenName && i.citizenName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || i.status === filterStatus;
    const matchWard = filterWard === 'All' || i.wardId === filterWard;
    const matchCat = filterCat === 'All' || i.category === filterCat;
    return matchSearch && matchStatus && matchWard && matchCat;
  });

  const handleStatusChange = async (issueId, newStatus) => {
    setUpdating(true);
    try {
      await updateReportStatus(issueId, newStatus, resolutionNotes);
      if (selected?.id === issueId) {
        setSelected(s => ({ ...s, status: newStatus }));
      }
    } finally {
      setUpdating(false);
    }
  };

  const advanceStatus = async (issueId, currentStatus) => {
    const next = STATUS_FLOW[currentStatus]?.next || (currentStatus === 'Pending' ? 'In Progress' : 'Resolved');
    await handleStatusChange(issueId, next);
  };

  const unresolvedCount = state.issues.filter(i => !['Resolved', 'Verified', 'Closed'].includes(i.status)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Citizen Issues & Triage Hub"
        subtitle={`${filtered.length} complaints shown · ${unresolvedCount} active unresolved in Kopargaon wards`}
      />

      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-3 flex-shrink-0">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Complaint ID (e.g. CF-KPG-1001), category, or ward..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
        >
          <option value="All">All Statuses</option>
          {ISSUE_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
        >
          <option value="All">All Categories</option>
          {ISSUE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
        <table className="w-full text-xs min-w-[900px]">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              {['Complaint ID', 'Category', 'Ward / Area', 'Description', 'Reported By', 'Timeline', 'Status', 'Workflow Action'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map(issue => (
              <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {issue.id}
                </td>
                <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                  {issue.category}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {getWardName(issue.wardId)}
                </td>
                <td className="px-4 py-3.5 max-w-[240px]">
                  <span className="line-clamp-2 text-slate-700 dark:text-slate-300 leading-snug">{issue.description}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {issue.isAnonymous ? 'Anonymous' : issue.citizenName}
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                  {getRelativeTime(issue.submittedDate)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setSelected(issue);
                        setSelectedDept(issue.assignedDepartment || DEPARTMENTS[0]);
                        setResolutionNotes('');
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Triage & Assign
                    </button>
                    {STATUS_FLOW[issue.status]?.next && (
                      <button
                        onClick={() => advanceStatus(issue.id, issue.status)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold whitespace-nowrap"
                      >
                        → {STATUS_FLOW[issue.status].next}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Triage and Resolution */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Triage Citizen Complaint ${selected?.id}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['Complaint ID', selected.id],
                ['Category', selected.category],
                ['Ward / Location', `${getWardName(selected.wardId)}, Kopargaon`],
                ['Reported Date', formatDate(selected.submittedDate)],
                ['Last Updated', formatDate(selected.updatedDate)],
                ['Citizen Reporter', selected.isAnonymous ? 'Anonymous' : selected.citizenName],
                ['GPS Coordinates', `${selected.lat ? selected.lat.toFixed(5) : 19.8917}, ${selected.lng ? selected.lng.toFixed(5) : 74.4789}`],
                ['Current Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-medium">{k}</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{v}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Issue Description</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selected.description}</p>
            </div>

            {/* Attached Photo Evidence */}
            {selected.photoUrl && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Image size={13} /> Attached Citizen Photo Evidence
                </div>
                <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer" onClick={() => setPreviewPhoto(selected.photoUrl)}>
                  <img src={selected.photoUrl} alt="Report Evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Department Assignment */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Assign Municipal Department
              </label>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Status Update Control */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Update Status (Persists to Supabase)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Reported', 'Under Review', 'In Progress', 'Resolved', 'Rejected'].map(st => (
                  <button
                    key={st}
                    disabled={updating}
                    onClick={() => handleStatusChange(selected.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selected.status === st
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {selected.status === 'In Progress' && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Resolution notes or remediation plan..."
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Expanded photo lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="max-w-2xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <img src={previewPhoto} alt="Evidence" className="w-full h-full object-contain rounded-xl" />
            <div className="flex justify-end p-2">
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
