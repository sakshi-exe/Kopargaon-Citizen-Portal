import React from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, MessageSquare, AlertTriangle, TrendingUp, MapPin, Activity, IndianRupee, ArrowRight } from 'lucide-react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import Header from '../../components/ui/Header.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { computeAllWardPriorities } from '../../utils/priorityScore.js';
import { TIER_STYLES } from '../../utils/priorityScore.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const { state } = useApp();
  const analytics = useAnalytics();
  const priorities = computeAllWardPriorities(state.infrastructure, state.issues, state.projects);

  const recentDelayed = state.projects.filter(p => p.status === 'Delayed').slice(0, 3);
  const recentIssues = state.issues.filter(i => i.status === 'Reported').slice(0, 4);

  // Chart data
  const projectStatusData = Object.entries(analytics.projects.byStatus).map(([name, value]) => ({ name, value }));
  const issueStatusData = [
    { name: 'Unresolved', value: analytics.issues.unresolvedCount, color: '#ef4444' },
    { name: 'Resolved/Closed', value: analytics.issues.resolvedCount, color: '#22c55e' },
  ];
  const infraCondData = Object.entries(analytics.infrastructure.conditionDist).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS = { 'Planned': '#94a3b8', 'Approved': '#3b82f6', 'In Progress': '#f59e0b', 'Delayed': '#ef4444', 'Completed': '#22c55e' };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="CivicFix Admin Command Dashboard"
        subtitle={`Kopargaon Municipal Council · Infrastructure Monitoring · ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Alerts */}
        {(analytics.projects.delayedCount > 0 || analytics.infrastructure.criticalCount > 0) && (
          <div className="flex flex-wrap gap-3">
            {analytics.projects.delayedCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                <AlertTriangle size={15} />
                <span><strong>{analytics.projects.delayedCount}</strong> project(s) are delayed</span>
                <Link to="/admin/projects" className="ml-1 underline text-xs">Review →</Link>
              </div>
            )}
            {analytics.infrastructure.criticalCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
                <AlertTriangle size={15} />
                <span><strong>{analytics.infrastructure.criticalCount}</strong> infrastructure item(s) in poor/critical condition</span>
                <Link to="/admin/infrastructure" className="ml-1 underline text-xs">Review →</Link>
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Infrastructure" value={analytics.infrastructure.total}
            subtitle={`Avg condition: ${analytics.infrastructure.avgCondition}/10 · ${analytics.infrastructure.criticalCount} critical`}
            icon={Package} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard title="Development Projects" value={analytics.projects.total}
            subtitle={`${analytics.projects.activeCount} active · ${analytics.projects.delayedCount} delayed`}
            icon={FolderOpen} iconBg="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" />
          <StatCard title="Citizen Complaints" value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} unresolved`}
            icon={MessageSquare} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-600 dark:text-red-400" />
          <StatCard title="Total Project Budget" value={formatCurrency(analytics.projects.totalBudget)}
            subtitle={`Utilised: ${formatCurrency(analytics.projects.totalSpent)}`}
            icon={IndianRupee} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Project status chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Projects by Status</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${value}`}>
                  {projectStatusData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Issue resolution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Complaint Resolution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={issueStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                  {issueStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-1">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.issues.resolutionRate}%</span>
              <span className="text-xs text-slate-500 ml-1">resolved</span>
            </div>
          </div>

          {/* Infra condition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Infrastructure Condition</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={infraCondData} margin={{ left: -20, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ward priorities */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Ward Priority Overview</h3>
              <Link to="/admin/insights" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                Full insights <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {priorities.slice(0, 5).map(ws => {
                const ts = TIER_STYLES[ws.tier];
                return (
                  <div key={ws.wardId} className="flex items-center gap-3 px-5 py-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ background: ts.dot }} />
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{ws.wardName}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ts.bg} ${ts.text}`}>{ws.tier}</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-8 text-right">{ws.score}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delayed projects */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Delayed Projects</h3>
              <Link to="/admin/projects" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {recentDelayed.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">No delayed projects 🎉</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentDelayed.map(p => (
                  <div key={p.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="text-xs text-slate-500">{getWardName(p.wardId)} · {formatCurrency(p.budget)} · {p.progress}% done</div>
                    <ProgressBar value={p.progress} color="red" size="xs" className="mt-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unresolved issues */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">New Reported Issues</h3>
            <Link to="/admin/issues" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              Manage all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentIssues.map(issue => (
              <div key={issue.id} className="flex items-start gap-3 px-5 py-3">
                <MapPin size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{issue.id}</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{issue.category}</span>
                    <span className="text-xs text-slate-400">{getWardName(issue.wardId)}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{issue.description.slice(0, 70)}…</div>
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
