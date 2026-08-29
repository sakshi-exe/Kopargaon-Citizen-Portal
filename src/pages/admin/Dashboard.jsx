import React from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, MessageSquare, AlertTriangle, MapPin, Activity, IndianRupee, ArrowRight, Search, Bell, Briefcase, Gauge, ShieldCheck, LayoutGrid } from 'lucide-react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import Header from '../../components/ui/Header.jsx';
import { formatCurrency } from '../../utils/formatters.js';
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

  const projectStatusData = Object.entries(analytics.projects.byStatus).map(([name, value]) => ({ name, value }));
  const issueStatusData = [
    { name: 'Unresolved', value: analytics.issues.unresolvedCount, color: '#f59e0b' },
    { name: 'Resolved/Closed', value: analytics.issues.resolvedCount, color: '#138808' },
  ];
  const infraCondData = Object.entries(analytics.infrastructure.conditionDist).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS = { 'Planned': '#94a3b8', 'Approved': '#000080', 'In Progress': '#FF9933', 'Delayed': '#ef4444', 'Completed': '#138808' };

  const quickActions = [
    { label: 'Report Overview', href: '/admin/issues', icon: MessageSquare, tone: 'saffron' },
    { label: 'Add Inspection', href: '/admin/field-inspection', icon: ShieldCheck, tone: 'green' },
    { label: 'Create Project', href: '/admin/projects', icon: Briefcase, tone: 'navy' },
    { label: 'Generate Report', href: '/admin/analytics', icon: LayoutGrid, tone: 'purple' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="CivicFix Admin Command Dashboard"
        subtitle={`Kopargaon Municipal Council · Infrastructure Monitoring · ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`}
        actions={(
          <>
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 md:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Search size={15} />
              <span>Search city data</span>
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-[#FF9933] hover:text-[#000080] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF9933]" />
            </button>
          </>
        )}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {(analytics.projects.delayedCount > 0 || analytics.infrastructure.criticalCount > 0) && (
          <div className="flex flex-wrap gap-3">
            {analytics.projects.delayedCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F6C4B4] bg-[#FFF6F2] px-4 py-2.5 text-sm text-[#7A2F1A] dark:border-[#7e3c31] dark:bg-[#2d1a1a] dark:text-[#f9c2b4]">
                <AlertTriangle size={15} />
                <span><strong>{analytics.projects.delayedCount}</strong> project(s) are delayed</span>
                <Link to="/admin/projects" className="ml-1 text-xs font-semibold underline">Review →</Link>
              </div>
            )}
            {analytics.infrastructure.criticalCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F3D8A5] bg-[#FFF9EE] px-4 py-2.5 text-sm text-[#734D00] dark:border-[#745d2d] dark:bg-[#292714] dark:text-[#f4d78d]">
                <AlertTriangle size={15} />
                <span><strong>{analytics.infrastructure.criticalCount}</strong> infrastructure items require attention</span>
                <Link to="/admin/infrastructure" className="ml-1 text-xs font-semibold underline">Review →</Link>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            const toneClasses = {
              saffron: 'bg-[#FFF2E6] text-[#7A3F00] border-[#FFD3A8] dark:bg-[#2a1d10] dark:text-[#ffd9a0] dark:border-[#5a3b1e]',
              green: 'bg-[#EAF9ED] text-[#0F5A1A] border-[#BAE8C5] dark:bg-[#162a1f] dark:text-[#a8e4b9] dark:border-[#355d40]',
              navy: 'bg-[#EEF3FF] text-[#000080] border-[#D3DFFF] dark:bg-[#14213c] dark:text-[#d2e0ff] dark:border-[#3e517e]',
              purple: 'bg-[#F3ECFF] text-[#5032A0] border-[#DDCCFF] dark:bg-[#231b39] dark:text-[#d7c2ff] dark:border-[#54407a]',
            }[action.tone];

            return (
              <Link
                key={action.label}
                to={action.href}
                className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold shadow-sm ${toneClasses}`}
              >
                <Icon size={16} />
                {action.label}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total Infrastructure" value={analytics.infrastructure.total}
            subtitle={`Avg condition ${analytics.infrastructure.avgCondition}/10 · ${analytics.infrastructure.criticalCount} critical`}
            icon={Package} iconBg="bg-[#EEF3FF]" iconColor="text-[#000080]" />
          <StatCard title="Development Projects" value={analytics.projects.total}
            subtitle={`${analytics.projects.activeCount} active · ${analytics.projects.delayedCount} delayed`}
            icon={FolderOpen} iconBg="bg-[#FFF2E6]" iconColor="text-[#FF9933]" />
          <StatCard title="Citizen Complaints" value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} unresolved`}
            icon={MessageSquare} iconBg="bg-[#FFF1F1]" iconColor="text-[#D93025]" />
          <StatCard title="Project Budget" value={formatCurrency(analytics.projects.totalBudget)}
            subtitle={`Utilised ${formatCurrency(analytics.projects.totalSpent)}`}
            icon={IndianRupee} iconBg="bg-[#EAF9ED]" iconColor="text-[#138808]" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#000080] dark:text-[#9bb8ff]">City intelligence</p>
                  <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Operational map overview</h3>
                </div>
                <Link to="/admin/gis-map" className="inline-flex items-center gap-1 text-xs font-bold text-[#000080] dark:text-[#b9d0ff]">
                  Open GIS <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#EEF3FF] p-4 dark:bg-[#14213c]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Issues</p>
                  <p className="mt-2 text-2xl font-black text-[#000080] dark:text-white">{analytics.issues.unresolvedCount}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Open complaints</p>
                </div>
                <div className="rounded-2xl bg-[#FFF2E6] p-4 dark:bg-[#2a1d10]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Projects</p>
                  <p className="mt-2 text-2xl font-black text-[#FF9933]">{analytics.projects.activeCount}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">In active delivery</p>
                </div>
                <div className="rounded-2xl bg-[#EAF9ED] p-4 dark:bg-[#162a1f]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Health</p>
                  <p className="mt-2 text-2xl font-black text-[#138808]">{analytics.infrastructure.avgCondition}/10</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Average condition</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Projects by status</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ value }) => `${value}`}>
                      {projectStatusData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Complaint resolution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={issueStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                      {issueStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-black text-[#138808] dark:text-[#5fd98a]">{analytics.issues.resolutionRate}%</span>
                  <span className="ml-1 text-xs text-slate-500">resolved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Ward performance</h3>
                <Link to="/admin/ward-analysis" className="text-xs font-bold text-[#000080] dark:text-[#b9d0ff]">Details</Link>
              </div>
              <div className="space-y-3">
                {priorities.slice(0, 5).map(ws => {
                  const ts = TIER_STYLES[ws.tier];
                  return (
                    <div key={ws.wardId} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: ts.dot }} />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ws.wardName}</span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ts.bg} ${ts.text}`}>{ws.tier}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <span>Score</span>
                        <span className="text-slate-700 dark:text-slate-300">{ws.score}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#138808] via-[#FF9933] to-[#FF9933]" style={{ width: `${Math.min(ws.score, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Needs attention</h3>
                <Link to="/admin/issues" className="text-xs font-bold text-[#000080] dark:text-[#b9d0ff]">All issues</Link>
              </div>
              <div className="space-y-3">
                {recentIssues.map(issue => (
                  <div key={issue.id} className="flex items-start gap-3 rounded-2xl bg-[#FFF8F3] p-3 dark:bg-[#201915]">
                    <MapPin size={14} className="mt-0.5 text-[#FF9933]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{issue.id}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{issue.category}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{getWardName(issue.wardId)}</div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Delayed projects</h3>
              <Link to="/admin/projects" className="text-xs font-bold text-[#000080] dark:text-[#b9d0ff]">Manage</Link>
            </div>
            {recentDelayed.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">No delayed projects</div>
            ) : (
              <div className="space-y-4">
                {recentDelayed.map(p => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="mb-2 text-[11px] text-slate-500">{getWardName(p.wardId)} · {formatCurrency(p.budget)}</div>
                    <ProgressBar value={p.progress} color="red" size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Infrastructure condition</h3>
              <Link to="/admin/infrastructure" className="text-xs font-bold text-[#000080] dark:text-[#b9d0ff]">View assets</Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={infraCondData} margin={{ left: -15, right: 5, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} fill="#000080" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Operational summary</h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF9ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#138808] dark:bg-[#172d1f] dark:text-[#9ae5b3]">
              <Activity size={12} /> Live
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-[#EEF3FF] p-4 dark:bg-[#14213c]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Infrastructure</div>
              <div className="mt-2 text-2xl font-black text-[#000080] dark:text-white">{analytics.infrastructure.total}</div>
            </div>
            <div className="rounded-2xl bg-[#FFF2E6] p-4 dark:bg-[#2a1d10]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Projects</div>
              <div className="mt-2 text-2xl font-black text-[#FF9933]">{analytics.projects.total}</div>
            </div>
            <div className="rounded-2xl bg-[#FFF1F1] p-4 dark:bg-[#2a1e1e]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Open issues</div>
              <div className="mt-2 text-2xl font-black text-[#D93025]">{analytics.issues.unresolvedCount}</div>
            </div>
            <div className="rounded-2xl bg-[#EAF9ED] p-4 dark:bg-[#162a1f]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Avg health</div>
              <div className="mt-2 text-2xl font-black text-[#138808]">{analytics.infrastructure.avgCondition}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
