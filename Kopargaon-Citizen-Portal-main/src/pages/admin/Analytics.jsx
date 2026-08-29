import React, { useState } from 'react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { wards } from '../../data/wards.js';
import { getLanduseColor } from '../../data/landuse.js';
import { Package, FolderOpen, MessageSquare, Layers } from 'lucide-react';

const TABS = ['Infrastructure', 'Projects', 'Citizen Issues', 'Land Use'];

const COLORS = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7','#14b8a6','#f97316','#6366f1','#84cc16','#ec4899'];
const STATUS_COLORS = { 'Planned': '#94a3b8', 'Approved': '#3b82f6', 'In Progress': '#f59e0b', 'Delayed': '#ef4444', 'Completed': '#22c55e' };

export default function AdminAnalytics() {
  const { state } = useApp();
  const analytics = useAnalytics();
  const [tab, setTab] = useState('Infrastructure');

  // ── Infrastructure charts data ─────────────────────────────────────────────
  const infraTypeData = Object.entries(analytics.infrastructure.byType)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const conditionData = Object.entries(analytics.infrastructure.conditionDist)
    .map(([name, value]) => ({ name: name.split(' ')[0], value, fullName: name }));

  const infraWardData = wards.map(w => ({
    ward: w.shortName,
    count: analytics.infrastructure.byWard[w.id] || 0,
    avgCond: Math.round(
      (state.infrastructure.filter(i => i.wardId === w.id).reduce((s, i) => s + i.condition, 0) /
        (state.infrastructure.filter(i => i.wardId === w.id).length || 1)) * 10
    ) / 10,
  }));

  // ── Project charts data ────────────────────────────────────────────────────
  const projectStatusData = Object.entries(analytics.projects.byStatus).map(([name, value]) => ({ name, value }));
  const projectCatData = Object.entries(analytics.projects.byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 8);
  const projectBudgetData = wards.map(w => ({
    ward: w.shortName,
    budget: state.projects.filter(p => p.wardId === w.id).reduce((s, p) => s + p.budget, 0) / 100000,
    spent: state.projects.filter(p => p.wardId === w.id).reduce((s, p) => s + p.spent, 0) / 100000,
  }));

  // ── Issue charts data ──────────────────────────────────────────────────────
  const issueCatData = Object.entries(analytics.issues.byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const issueStatusData = Object.entries(analytics.issues.byStatus).map(([name, value]) => ({ name, value }));
  const issueWardData = wards.map(w => ({
    ward: w.shortName,
    total: analytics.issues.byWard[w.id] || 0,
    unresolved: state.issues.filter(i => i.wardId === w.id && !['Resolved', 'Closed'].includes(i.status)).length,
  }));

  // ── Land use charts data ───────────────────────────────────────────────────
  const areaByType = {};
  state.landUseZones.forEach(z => { areaByType[z.type] = (areaByType[z.type] || 0) + z.area; });
  const landuseAreaData = Object.entries(areaByType).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

  const wardLanduseData = wards.map(w => {
    const wZones = state.landUseZones.filter(z => z.wardId === w.id);
    return {
      ward: w.shortName,
      Residential: wZones.filter(z => z.type === 'Residential').reduce((s, z) => s + z.area, 0).toFixed(1),
      Commercial: wZones.filter(z => z.type === 'Commercial').reduce((s, z) => s + z.area, 0).toFixed(1),
      Industrial: wZones.filter(z => z.type === 'Industrial').reduce((s, z) => s + z.area, 0).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Analytics Dashboard" subtitle="Data-driven insights from all modules" />

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <StatCard title="Infrastructure Items" value={analytics.infrastructure.total}
          subtitle={`Avg: ${analytics.infrastructure.avgCondition}/10`}
          icon={Package} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
        <StatCard title="Total Projects" value={analytics.projects.total}
          subtitle={`Budget: ${formatCurrency(analytics.projects.totalBudget)}`}
          icon={FolderOpen} iconBg="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" />
        <StatCard title="Citizen Issues" value={analytics.issues.total}
          subtitle={`${analytics.issues.resolutionRate}% resolved`}
          icon={MessageSquare} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-600 dark:text-red-400" />
        <StatCard title="Land-Use Zones" value={state.landUseZones.length}
          subtitle={`${Object.keys(areaByType).length} zone types`}
          icon={Layers} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
      </div>

      {/* Tab selector */}
      <div className="flex px-6 pt-4 gap-1 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Chart content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ── Infrastructure Tab ─────────────────────────────────────────── */}
        {tab === 'Infrastructure' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Infrastructure by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={infraTypeData} layout="vertical" margin={{ left: 60, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="value" name="Count" radius={[0,3,3,0]}>
                      {infraTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Condition Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={conditionData} margin={{ left: -20, right: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip labelFormatter={(l) => conditionData.find(d => d.name === l)?.fullName || l} />
                    <Bar dataKey="value" name="Items" radius={[3,3,0,0]}>
                      {conditionData.map((_, i) => <Cell key={i} fill={['#22c55e','#22c55e','#eab308','#f97316','#ef4444'][i % 5]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Infrastructure Count & Avg Condition by Ward</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={infraWardData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="count" name="Count" fill="#3b82f6" radius={[3,3,0,0]} />
                  <Bar yAxisId="right" dataKey="avgCond" name="Avg Condition" fill="#22c55e" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Projects Tab ───────────────────────────────────────────────── */}
        {tab === 'Projects' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Projects by Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                      {projectStatusData.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || '#94a3b8'} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Projects by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={projectCatData} layout="vertical" margin={{ left: 80, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" name="Projects" fill="#f59e0b" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Budget vs. Expenditure by Ward (₹ Lakhs)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={projectBudgetData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `₹${v.toFixed(1)}L`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[3,3,0,0]} />
                  <Bar dataKey="spent" name="Spent" fill="#22c55e" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Citizen Issues Tab ─────────────────────────────────────────── */}
        {tab === 'Citizen Issues' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Issues by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={issueCatData} layout="vertical" margin={{ left: 80, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" name="Issues" fill="#ef4444" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Issues by Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={issueStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, value }) => `${value}`}>
                      {issueStatusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Total vs. Unresolved Issues by Ward</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={issueWardData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="total" name="Total Issues" fill="#94a3b8" radius={[3,3,0,0]} />
                  <Bar dataKey="unresolved" name="Unresolved" fill="#ef4444" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Land Use Tab ───────────────────────────────────────────────── */}
        {tab === 'Land Use' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Area by Land-Use Type (km²)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={landuseAreaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {landuseAreaData.map((e, i) => <Cell key={i} fill={getLanduseColor(e.name)} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v} km²`} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Land-Use Summary</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Area (km²) per zone type across the city</p>
                <div className="space-y-2.5">
                  {landuseAreaData.sort((a,b) => b.value - a.value).map(d => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: getLanduseColor(d.name) }} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{d.name}</span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 max-w-[120px]">
                        <div className="h-2 rounded-full" style={{ width: `${(d.value / landuseAreaData.reduce((s,x) => s+x.value, 0)) * 100}%`, background: getLanduseColor(d.name) }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-12 text-right">{d.value} km²</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Residential / Commercial / Industrial by Ward (km²)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={wardLanduseData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Residential" fill="#fbbf24" radius={[3,3,0,0]} />
                  <Bar dataKey="Commercial" fill="#f97316" radius={[3,3,0,0]} />
                  <Bar dataKey="Industrial" fill="#94a3b8" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
