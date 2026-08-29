import React from 'react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { Eye, CheckCircle, AlertTriangle, MapPin, Calendar } from 'lucide-react';

export default function AdminTransparency() {
  const { state } = useApp();
  const analytics = useAnalytics();
  const publicProjects = state.projects.filter(p => p.status !== 'Planned');
  const publicIssues = state.issues.filter(i => ['Reported', 'Under Review', 'Assigned', 'In Progress'].includes(i.status));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Public Transparency" subtitle="Information published for citizen access" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <Eye size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Public Transparency Dashboard — Admin View</p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
              This page shows what is publicly visible to citizens via the Transparency section.
              Sensitive internal documents and non-public project details are not included.
              Budget figures shown are as per approved project DPRs.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Published Projects', value: publicProjects.length },
            { label: 'Completed Projects', value: analytics.projects.completedCount },
            { label: 'Total Budget (published)', value: formatCurrency(publicProjects.reduce((s, p) => s + p.budget, 0)) },
            { label: 'Open Civic Issues', value: publicIssues.length },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <div className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Projects table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Public Project Register</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  {['Project', 'Ward', 'Department', 'Budget', 'Utilised', 'Exp. End', 'Progress', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {publicProjects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.id}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1"><MapPin size={10} />{getWardName(p.wardId)}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[120px] leading-tight">{p.department}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{formatCurrency(p.budget)}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{getBudgetUtilization(p.spent, p.budget)}%</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1"><Calendar size={10} />{formatDate(p.expectedEnd)}</div>
                    </td>
                    <td className="px-4 py-3 w-24"><ProgressBar value={p.progress} color="auto" size="sm" showLabel /></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open issues public summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Open Civic Issues — Public Summary</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {publicIssues.map(issue => (
              <div key={issue.id} className="flex items-start gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{issue.id}</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{issue.category}</span>
                    <span className="text-xs text-slate-400">— {getWardName(issue.wardId)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{issue.description}</p>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
