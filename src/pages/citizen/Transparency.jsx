import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import {
  Eye, IndianRupee, Calendar, MapPin, CheckCircle, ShieldCheck,
  FileCheck, QrCode, ArrowRight, UserCheck, AlertTriangle
} from 'lucide-react';

export default function CitizenTransparency() {
  const { state, dispatch } = useApp();
  const publicProjects = state.projects;
  const completedCount = publicProjects.filter(p => p.status === 'Completed').length;
  const totalBudget = publicProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = publicProjects.reduce((s, p) => s + p.spent, 0);

  const handleOpenAsset = (p) => {
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
        title="Kopargaon Planning & Infrastructure Transparency"
        subtitle="Open public register — Know what is behind your city's infrastructure"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Transparency Banner: "Know What Is Behind Your Infrastructure" */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white border border-slate-700 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={26} className="text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Know What Is Behind Your Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                CivicFix ensures full municipal accountability in Kopargaon. Every citizen can inspect who built a road or drain, what project funded it, approved budget vs expenditure, current condition score, verified field inspections, and full maintenance history.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Published Public Works', value: publicProjects.length, icon: '📋' },
            { label: 'Verified Completed', value: completedCount, icon: '✅' },
            { label: 'Total Approved Budget', value: formatCurrency(totalBudget), icon: '💰' },
            { label: 'Expenditure Utilised', value: formatCurrency(totalSpent), icon: '📊' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Public Project & Asset Register Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Kopargaon Municipal Project & QR Audit Register
              </h3>
            </div>
            <span className="text-xs text-slate-500">Updated August 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="text-left px-5 py-3.5">Project & Asset ID</th>
                  <th className="text-left px-4 py-3.5">Ward / Location</th>
                  <th className="text-left px-4 py-3.5">Contractor</th>
                  <th className="text-left px-4 py-3.5">Budget & DPR</th>
                  <th className="text-left px-4 py-3.5">Completion Target</th>
                  <th className="text-left px-4 py-3.5">Progress</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-left px-4 py-3.5">Public Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {publicProjects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</div>
                      <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">{p.id}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin size={12} className="text-teal-500" />
                        {getWardName(p.wardId)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[150px] truncate text-slate-700 dark:text-slate-300">
                      {p.contractor || 'KMC Engineering Div'}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.budget)}</div>
                      <div className="text-[10px] text-slate-400">Utilised: {getBudgetUtilization(p.spent, p.budget)}%</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(p.expectedEnd)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 w-28">
                      <ProgressBar value={p.progress} color="auto" size="sm" showLabel />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenAsset(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
                      >
                        <QrCode size={12} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
