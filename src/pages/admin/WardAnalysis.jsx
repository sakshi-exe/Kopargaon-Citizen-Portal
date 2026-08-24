import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge, Badge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { computeWardPriorityScore, TIER_STYLES, FACTOR_LABELS } from '../../utils/priorityScore.js';
import { generateWardInsights, INSIGHT_TYPE_STYLES } from '../../utils/insights.js';
import { getLanduseColor } from '../../data/landuse.js';
import { wards } from '../../data/wards.js';
import { formatCurrency } from '../../utils/formatters.js';
import {
  MapPin, Users, Activity, FolderOpen, MessageSquare, Layers,
  AlertTriangle, CheckCircle2, ShieldCheck, QrCode, ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function WardAnalysis() {
  const { state, dispatch } = useApp();
  // Default to Ward 12 (highest priority ward in Kopargaon)
  const [wardId, setWardId] = useState('W12');

  const ward = wards.find(w => w.id === wardId) || wards[0];
  const wardInfra = state.infrastructure.filter(i => i.wardId === wardId);
  const wardIssues = state.issues.filter(i => i.wardId === wardId);
  const wardProjects = state.projects.filter(p => p.wardId === wardId);
  const wardZones = state.landUseZones.filter(z => z.wardId === wardId);

  const score = computeWardPriorityScore(wardId, state.infrastructure, state.issues, state.projects);
  const insights = score ? generateWardInsights(score, state.infrastructure, state.issues, state.projects) : [];

  const ts = score ? TIER_STYLES[score.tier] : TIER_STYLES.LOW;

  const avgCondition = wardInfra.length > 0
    ? (wardInfra.reduce((s, i) => s + i.condition, 0) / wardInfra.length).toFixed(1)
    : 'N/A';
  const unresolvedCount = wardIssues.filter(i => !['Resolved', 'Verified', 'Closed'].includes(i.status)).length;
  const delayedCount = wardProjects.filter(p => p.status === 'Delayed').length;

  // Breakdown metrics for Kopargaon Ward
  const roadIssuesCount = wardIssues.filter(i => ['Road Damage', 'Pothole'].includes(i.category)).length;
  const waterDrainIssuesCount = wardIssues.filter(i => ['Water Problem', 'Drainage'].includes(i.category)).length;
  const lightIssuesCount = wardIssues.filter(i => i.category === 'Street Light').length;

  // Land use pie data
  const areaByType = {};
  wardZones.forEach(z => { areaByType[z.type] = (areaByType[z.type] || 0) + z.area; });
  const landuseData = Object.entries(areaByType).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Ward Infrastructure & Priority Analysis"
        subtitle="Select a municipal ward to analyze infrastructure condition, citizen complaint density, and resource priority"
      />

      {/* Ward Selector Bar */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto flex-shrink-0 scrollbar-thin">
        {wards.map(w => {
          const ws = computeWardPriorityScore(w.id, state.infrastructure, state.issues, state.projects);
          const wts = ws ? TIER_STYLES[ws.tier] : TIER_STYLES.LOW;
          return (
            <button
              key={w.id}
              onClick={() => setWardId(w.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                wardId === w.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : `${wts.bg} ${wts.text} ${wts.border} hover:opacity-85`
              }`}
            >
              <span>{w.shortName}</span>
              {ws && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${wardId === w.id ? 'bg-white/20 text-white' : 'bg-black/10'}`}>
                  {ws.score}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Ward Analysis Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Hero Ward Header with Priority Score & Reason Breakdown */}
        <div className={`rounded-2xl border-2 p-6 ${ts.bg} ${ts.border} shadow-sm`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/60 dark:bg-slate-900/60 border border-current">
                  KOPARGAON WARD {ward?.wardNumber || wardId.replace('W', '')}
                </span>
                <span className="text-xs text-slate-500 font-medium">Ahmednagar District</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {ward?.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {ward?.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Users size={14} /> {ward?.population.toLocaleString()} Residents</span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {ward?.area} km² Total Area</span>
              </div>
            </div>

            {/* Big Priority Score Badge & Key Reasons */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center min-w-[220px] shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Priority Score
              </div>
              <div className={`text-4xl font-black mt-0.5 ${ts.text}`}>
                {score?.score || 0}<span className="text-xl text-slate-400 font-normal"> / 100</span>
              </div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-extrabold border ${ts.bg} ${ts.text} ${ts.border}`}>
                {score?.tier || 'LOW'} PRIORITY
              </div>

              {/* Reasons list */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-left w-full space-y-1 text-slate-600 dark:text-slate-400">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase">Identified Factors:</div>
                {score?.score >= 60 ? (
                  <>
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      • Poor road & drainage condition
                    </div>
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      • High citizen complaint density
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      • Delayed project maintenance
                    </div>
                  </>
                ) : (
                  <div className="text-emerald-600 dark:text-emerald-400">
                    • Infrastructure in stable operational status
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4-KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Infrastructure Assets</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{wardInfra.length} Assets</div>
            <div className="text-xs text-slate-400 mt-0.5">Avg condition: <strong className="text-slate-700 dark:text-slate-300">{avgCondition}/10</strong></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Citizen Reports (Active)</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{unresolvedCount} Pending</div>
            <div className="text-xs text-slate-400 mt-0.5">{wardIssues.length} total logged tickets</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Active / Delayed Projects</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{wardProjects.length} Projects</div>
            <div className="text-xs text-red-500 font-medium mt-0.5">{delayedCount} currently delayed</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Complaints Breakdown</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 space-y-0.5">
              <div>🛣️ Road / Potholes: <strong>{roadIssuesCount}</strong></div>
              <div>🌊 Water & Drainage: <strong>{waterDrainIssuesCount}</strong></div>
              <div>💡 Street Lights: <strong>{lightIssuesCount}</strong></div>
            </div>
          </div>
        </div>

        {/* 3-Column Asset / Project / Land-Use View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Infrastructure Assets List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Infrastructure Assets ({wardInfra.length})</span>
              <span className="text-[10px] text-slate-400">QR Tagged</span>
            </div>
            <div className="p-4 divide-y divide-slate-100 dark:divide-slate-700/60 overflow-y-auto max-h-72">
              {wardInfra.map(item => (
                <div
                  key={item.id}
                  onClick={() => dispatch({ type: 'OPEN_ASSET_MODAL', payload: item })}
                  className="py-2.5 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.id}</span>
                    <span className="font-bold" style={{ color: getConditionColor(item.condition) }}>
                      {item.condition}/10
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.type} · {item.maintenanceStatus}</div>
                </div>
              ))}
              {wardInfra.length === 0 && <div className="text-xs text-slate-400 p-3">No assets registered in this ward.</div>}
            </div>
          </div>

          {/* Development Projects List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Development Projects ({wardProjects.length})</span>
              <span className="text-[10px] text-slate-400">Monitored</span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-72">
              {wardProjects.map(p => (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-start justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <ProgressBar value={p.progress} color="auto" size="xs" />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Budget: {formatCurrency(p.budget)}</span>
                    <span>{p.progress}% done</span>
                  </div>
                </div>
              ))}
              {wardProjects.length === 0 && <div className="text-xs text-slate-400 p-3">No ongoing projects in this ward.</div>}
            </div>
          </div>

          {/* Land Use Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200">
              Land-Use Distribution
            </div>
            <div className="p-4 flex flex-col items-center justify-center flex-1">
              {landuseData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={landuseData} dataKey="value" cx="50%" cy="50%" outerRadius={50}>
                        {landuseData.map((e, i) => <Cell key={i} fill={getLanduseColor(e.name)} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v} km²`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 w-full mt-2">
                    {landuseData.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: getLanduseColor(d.name) }} />
                          <span>{d.name}</span>
                        </div>
                        <span className="font-semibold">{d.value} km²</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-400">No zoned landuse data.</div>
              )}
            </div>
          </div>

        </div>

        {/* Planning Insights for this Ward */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Data-Driven Planning Insights & Resource Recommendations
            </h3>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const style = INSIGHT_TYPE_STYLES[ins.type] || INSIGHT_TYPE_STYLES.info;
              return (
                <div key={i} className={`p-4 rounded-xl border ${style.bg} ${style.border} shadow-sm`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{ins.icon}</span>
                    <div>
                      <h4 className={`text-sm font-bold ${style.title}`}>{ins.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {ins.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent 5-Factor Score Breakdown */}
        {score && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Transparent Priority Scoring Formula Breakdown
              </h4>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Total: {score.score} / 100
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(score.factors).map(([key, val]) => {
                const fl = FACTOR_LABELS[key];
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>{fl.label}</span>
                      <span>{val} / {fl.max} pts</span>
                    </div>
                    <ProgressBar value={val} max={fl.max} color="auto" size="sm" />
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{fl.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
