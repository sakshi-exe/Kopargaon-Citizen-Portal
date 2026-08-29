import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import {
  Eye, IndianRupee, Calendar, MapPin, CheckCircle, ShieldCheck,
  FileCheck, QrCode, ArrowRight, UserCheck, AlertTriangle, Briefcase, FileSpreadsheet, CheckCircle2, TrendingUp
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
        title="Planning & Municipal Infrastructure Transparency"
        subtitle="Open public register — Comprehensive accountability for public expenditures and contractors"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Transparency Banner: "Know What Is Behind Your Infrastructure" */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="civic-tricolour-stripe absolute top-0 left-0 right-0" />
          <div className="flex items-start gap-4 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={26} className="text-saffron-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Know What Is Behind Your Civic Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-3xl font-medium">
                CivicFix ensures full municipal accountability in Kopargaon. Every citizen can inspect who built a road or drain, what project funded it, approved budget vs expenditure, current condition score, verified field inspections, and full maintenance history.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Published Works</span>
              <Briefcase size={16} className="text-navy-600 dark:text-saffron-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{publicProjects.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Approved civil tenders</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified Delivered</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Commissioned assets</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Approved Budget</span>
              <IndianRupee size={16} className="text-navy-600 dark:text-saffron-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(totalBudget)}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Total sanctioned capital</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Expenditure Utilised</span>
              <TrendingUp size={16} className="text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(totalSpent)}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              {getBudgetUtilization(totalSpent, totalBudget)}% cumulative spent
            </div>
          </div>
        </div>

        {/* Public Project & Asset Register Table */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet size={18} className="text-navy-600 dark:text-saffron-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                Kopargaon Municipal Project & QR Audit Register
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Updated August 2026 · KMC Public Works</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {publicProjects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</div>
                      <div className="text-[10px] font-mono text-navy-700 dark:text-saffron-400 font-bold mt-0.5">{p.id}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <MapPin size={13} className="text-navy-600 dark:text-saffron-400" />
                        {getWardName(p.wardId)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[150px] truncate text-slate-700 dark:text-slate-300 font-medium">
                      {p.contractor || 'KMC Engineering Div'}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(p.budget)}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Utilised: {getBudgetUtilization(p.spent, p.budget)}%</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" /> {formatDate(p.expectedEnd)}
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors text-[11px]"
                      >
                        <QrCode size={13} className="text-navy-700 dark:text-saffron-400" /> View Profile
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

