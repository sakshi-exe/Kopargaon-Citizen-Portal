import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { ConditionBadge, Badge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { formatDate } from '../../utils/formatters.js';
import { getConditionColor } from '../../data/infrastructure.js';
import { getWardName } from '../../data/wards.js';
import { INFRA_TYPES, MAINTENANCE_STATUS } from '../../data/infrastructure.js';
import { wards } from '../../data/wards.js';
import { Search, Filter, AlertTriangle, QrCode, Edit, ShieldCheck } from 'lucide-react';

export default function AdminInfrastructure() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterWard, setFilterWard] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const filtered = state.infrastructure.filter(i => {
    const matchSearch = !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      (i.contractor && i.contractor.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === 'All' || i.type === filterType;
    const matchWard = filterWard === 'All' || i.wardId === filterWard;
    return matchSearch && matchType && matchWard;
  });

  const startEdit = (item) => {
    setEditForm({ condition: item.condition, maintenanceStatus: item.maintenanceStatus, lastInspection: item.lastInspection });
    setEditMode(true);
  };

  const saveEdit = () => {
    dispatch({ type: 'UPDATE_INFRASTRUCTURE', payload: { infraId: selectedItem.id, updates: editForm } });
    setSelectedItem(s => ({ ...s, ...editForm }));
    setEditMode(false);
  };

  const condBar = (c) => {
    const colors = ['', '#ef4444','#ef4444','#f97316','#f97316','#eab308','#eab308','#22c55e','#22c55e','#10b981','#10b981'];
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 w-16">
          <div className="h-1.5 rounded-full" style={{ width: `${c * 10}%`, background: colors[c] }} />
        </div>
        <span className="text-xs font-bold" style={{ color: colors[c] }}>{c}/10</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Infrastructure & QR Asset Inventory"
        subtitle={`${filtered.length} of ${state.infrastructure.length} registered municipal assets`}
      />

      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 min-w-48 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Asset ID (e.g. ROAD-KPG-1028), name, or contractor..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
        >
          <option value="All">All Asset Categories</option>
          {INFRA_TYPES.map(t => <option key={t}>{t}</option>)}
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
              {['Asset QR ID', 'Infrastructure Name', 'Category', 'Ward / Area', 'Condition', 'Maintenance', 'Last Inspection', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {item.id}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{item.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.contractor || 'KMC PWD'}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">{item.type}</td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{getWardName(item.wardId)}</td>
                <td className="px-4 py-3.5">
                  {condBar(item.condition)}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={item.maintenanceStatus === 'Overdue' ? 'red' : item.maintenanceStatus === 'Due' ? 'amber' : 'green'}>
                    {item.maintenanceStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(item.lastInspection)}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch({ type: 'OPEN_ASSET_MODAL', payload: item })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors"
                      title="View QR Tag & Public Transparency Profile"
                    >
                      <QrCode size={12} /> QR Profile
                    </button>
                    <button
                      onClick={() => { setSelectedItem(item); setEditMode(true); startEdit(item); }}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Edit Record"
                    >
                      <Edit size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      <Modal isOpen={!!selectedItem && editMode} onClose={() => { setSelectedItem(null); setEditMode(false); }} title={`Edit Asset ${selectedItem?.id}`} size="md">
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Condition Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={editForm.condition}
                onChange={e => setEditForm(f => ({ ...f, condition: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Maintenance Status</label>
              <select
                value={editForm.maintenanceStatus}
                onChange={e => setEditForm(f => ({ ...f, maintenanceStatus: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"
              >
                {MAINTENANCE_STATUS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Last Inspection Date</label>
              <input
                type="date"
                value={editForm.lastInspection}
                onChange={e => setEditForm(f => ({ ...f, lastInspection: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">Save Changes</button>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
