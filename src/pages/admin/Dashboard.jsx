import React from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, MessageSquare, AlertTriangle, TrendingUp, MapPin, Activity, IndianRupee, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    { name: 'Resolved/Closed', value: analytics.issues.resolvedCount, color: '#138808' },
  ];
  const infraCondData = Object.entries(analytics.infrastructure.conditionDist).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS = { 'Planned': '#94a3b8', 'Approved': '#000080', 'In Progress': '#FF9933', 'Delayed': '#ef4444', 'Completed': '#138808' };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Municipal Command & Operations Dashboard"
        subtitle={`Kopargaon Municipal Council · Engineering & Operations Cell · ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`}
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Operational Alerts */}
        {(analytics.projects.delayedCount > 0 || analytics.infrastructure.criticalCount > 0) && (
          <div className="flex flex-wrap gap-3">
            {analytics.projects.delayedCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-xs sm:text-sm text-red-800 dark:text-red-300 font-semibold shadow-2xs">
                <AlertTriangle size={15} className="text-red-600 flex-shrink-0" />
                <span><strong>{analytics.projects.delayedCount}</strong> civil project(s) behind schedule</span>
                <Link to="/admin/projects" className="ml-1 text-red-700 dark:text-red-400 font-bold underline">Review →</Link>
              </div>
            )}
            {analytics.infrastructure.criticalCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-semibold shadow-2xs">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
                <span><strong>{analytics.infrastructure.criticalCount}</strong> infrastructure asset(s) in critical condition</span>
                <Link to="/admin/infrastructure" className="ml-1 text-amber-700 dark:text-amber-400 font-bold underline">Inspect →</Link>
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Infrastructure"
            value={analytics.infrastructure.total}
            subtitle={`Avg condition: ${analytics.infrastructure.avgCondition}/10 · ${analytics.infrastructure.criticalCount} critical`}
            icon={Package}
            accentColor="#000080"
          />
          <StatCard
            title="Development Projects"
            value={analytics.projects.total}
            subtitle={`${analytics.projects.activeCount} active · ${analytics.projects.delayedCount} delayed`}
            icon={FolderOpen}
            accentColor="#FF9933"
          />
          <StatCard
            title="Citizen Complaints"
            value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} open grievances`}
            icon={MessageSquare}
            accentColor="#ef4444"
          />
          <StatCard
            title="Total Project Budget"
            value={formatCurrency(analytics.projects.totalBudget)}
            subtitle={`Utilised: ${formatCurrency(analytics.projects.totalSpent)}`}
            icon={IndianRupee}
            accentColor="#138808"
          />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Project status chart */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
              Projects by Execution Status
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={35} label={({ name, value }) => `${value}`}>
                  {projectStatusData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Issue resolution */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
              Grievance Resolution Rate
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={issueStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={35}>
                  {issueStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.issues.resolutionRate}%</span>
              <span className="text-xs text-slate-500 font-semibold ml-1.5">Resolved by Ward Teams</span>
            </div>
          </div>

          {/* Infra condition */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
              Asset Condition Distribution
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={infraCondData} margin={{ left: -20, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e120" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip />
                <Bar dataKey="value" name="Assets" fill="#000080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ward priorities */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Ward Priority Ranking</h3>
              <Link to="/admin/insights" className="text-xs font-bold text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline">
                Full Insights <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {priorities.slice(0, 5).map(ws => {
                const ts = TIER_STYLES[ws.tier];
                return (
                  <div key={ws.wardId} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ts.dot }} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex-1">{ws.wardName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ts.bg} ${ts.text}`}>{ws.tier}</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{ws.score}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delayed projects */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Critical Delayed Projects</h3>
              <Link to="/admin/projects" className="text-xs font-bold text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline">
                Manage All <ArrowRight size={12} />
              </Link>
            </div>
            {recentDelayed.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-slate-400 font-semibold">No delayed projects in Kopargaon 🎉</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentDelayed.map(p => (
                  <div key={p.id} className="px-5 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{getWardName(p.wardId)} · {formatCurrency(p.budget)} · {p.progress}% delivered</div>
                    <ProgressBar value={p.progress} color="red" size="xs" className="mt-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unresolved issues */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Recent Citizen Grievance Logs</h3>
            <Link to="/admin/issues" className="text-xs font-bold text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline">
              Grievance Desk <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentIssues.map(issue => (
              <div key={issue.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-navy-700 dark:text-saffron-400">{issue.id}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{issue.category}</span>
                    <span className="text-[11px] text-slate-400 font-medium">· {getWardName(issue.wardId)}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">{issue.description}</div>
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

