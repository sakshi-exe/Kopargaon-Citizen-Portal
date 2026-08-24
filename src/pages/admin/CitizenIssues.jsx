import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { getWardName } from '../../data/wards.js';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, STATUS_FLOW } from '../../data/issues.js';
import { wards } from '../../data/wards.js';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { Search, MapPin, Clock, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

export default function AdminCitizenIssues() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWard, setFilterWard] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [selected, setSelected] = useState(null);

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

  const advanceStatus = (issueId, currentStatus) => {
    const next = STATUS_FLOW[currentStatus]?.next;
    if (!next) return;
    dispatch({ type: 'UPDATE_ISSUE_STATUS', payload: { issueId, newStatus: next } });
    if (selected?.id === issueId) setSelected(s => ({ ...s, status: next }));
  };

  const unresolvedCount = state.issues.filter(i => !['Resolved', 'Verified', 'Closed'].includes(i.status)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Citizen Issues Triage"
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
        <table className="w-full text-xs min-w-[850px]">
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
                <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{issue.id}</td>
                <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">{issue.category}</td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{getWardName(issue.wardId)}</td>
                <td className="px-4 py-3.5 max-w-[240px]">
                  <span className="line-clamp-2 text-slate-700 dark:text-slate-300 leading-snug">{issue.description}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {issue.isAnonymous ? 'Anonymous' : issue.citizenName}
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">{getRelativeTime(issue.submittedDate)}</td>
                <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={issue.status} /></td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setSelected(issue)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      View
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

      {/* Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Citizen Complaint ${selected?.id}`} size="md">
        {selected && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Complaint ID', selected.id],
                ['Category', selected.category],
                ['Ward / Location', `${getWardName(selected.wardId)}, Kopargaon`],
                ['Reported Date', formatDate(selected.submittedDate)],
                ['Last Updated', formatDate(selected.updatedDate)],
                ['Citizen Reporter', selected.isAnonymous ? 'Anonymous' : selected.citizenName],
                ['GPS Coordinates', `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}`],
                ['Linked Asset ID', selected.linkedAssetId || 'General Area'],
              ].map(([k, v]) => (
                <div key={k} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-medium">{k}</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Issue Description</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selected.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Status:</span>
                <StatusBadge status={selected.status} />
              </div>

              {STATUS_FLOW[selected.status]?.next && (
                <button
                  onClick={() => advanceStatus(selected.id, selected.status)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm"
                >
                  <CheckCircle size={14} /> Advance to {STATUS_FLOW[selected.status].next}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
