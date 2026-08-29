import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { computeAllWardPriorities, TIER_STYLES, FACTOR_LABELS } from '../../utils/priorityScore.js';
import { generateWardInsights, generateCityInsights, INSIGHT_TYPE_STYLES } from '../../utils/insights.js';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Lightbulb, TrendingUp, Info, CheckCircle, ShieldCheck } from 'lucide-react';

function PriorityScoreCard({ wardScore, isSelected, onClick }) {
  const ts = TIER_STYLES[wardScore.tier];
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
        isSelected ? 'border-blue-500 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20' : `${ts.border} hover:shadow-sm`
      } ${ts.bg}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{wardScore.wardName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Pop: {wardScore.population.toLocaleString()} · {wardScore.area} km²
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-black ${ts.text}`}>{wardScore.score}</div>
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ts.bg} ${ts.text} border ${ts.border} mt-0.5`}>
            {wardScore.tier}
          </div>
        </div>
      </div>

      {/* Factor mini-bars */}
      <div className="space-y-1.5 pt-1">
        {Object.entries(wardScore.factors).map(([key, val]) => {
          const fl = FACTOR_LABELS[key];
          return (
            <div key={key}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-slate-600 dark:text-slate-400 truncate pr-2">{fl.label}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{val}/{fl.max}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${ts.text.includes('red') ? 'bg-red-500' : ts.text.includes('amber') ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(val / fl.max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const style = INSIGHT_TYPE_STYLES[insight.type] || INSIGHT_TYPE_STYLES.info;
  const Icon = insight.type === 'critical' ? AlertTriangle : insight.type === 'success' ? CheckCircle : insight.type === 'warning' ? AlertTriangle : Info;
  return (
    <div className={`rounded-2xl border p-4.5 ${style.bg} ${style.border} shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className={`text-xl flex-shrink-0 ${style.icon}`}>{insight.icon || '💡'}</span>
        <div>
          <div className={`text-sm font-bold mb-1 ${style.title}`}>{insight.title}</div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPlanningInsights() {
  const { state } = useApp();
  const [selectedWardId, setSelectedWardId] = useState('W12');

  const allScores = computeAllWardPriorities(state.infrastructure, state.issues, state.projects);
  const cityInsights = generateCityInsights(allScores, state.infrastructure, state.issues, state.projects);

  const selectedScore = allScores.find(s => s.wardId === selectedWardId);
  const wardInsights = selectedScore
    ? generateWardInsights(selectedScore, state.infrastructure, state.issues, state.projects)
    : null;

  // Radar data for selected ward
  const radarData = selectedScore ? Object.entries(selectedScore.factors).map(([key, val]) => ({
    subject: FACTOR_LABELS[key].label.split(' ')[0],
    value: val,
    max: FACTOR_LABELS[key].max,
    fullLabel: FACTOR_LABELS[key].label,
  })) : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Urban Planning Insights"
        subtitle="Algorithmic resource allocation recommendations based on verified field & GIS data"
      />

      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        {/* Official Governance Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            <strong>Data-Driven Advisory:</strong> All insights and priority rankings generated on this page are algorithmic suggestions based on available data from the CivicFix Kopargaon platform. They are intended to support — not replace — official planning and budget allocations by the Kopargaon Municipal Council and competent urban planning authorities. Wording such as "recommended", "potential priority", and "based on available data" is used throughout.
          </p>
        </div>

        {/* City-level strategic insights */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-teal-500" /> City-Level Strategic Recommendations (Kopargaon)
          </h2>
          <div className="space-y-3">
            {cityInsights.map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        </div>

        {/* Ward priority cards grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" /> Ward Priority Scores (Click any ward for detailed radar breakdown)
            </h2>
            <span className="text-xs text-slate-400">12 Wards Analyzed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allScores.map(ws => (
              <PriorityScoreCard
                key={ws.wardId}
                wardScore={ws}
                isSelected={selectedWardId === ws.wardId}
                onClick={() => setSelectedWardId(ws.wardId === selectedWardId ? null : ws.wardId)}
              />
            ))}
          </div>
        </div>

        {/* Ward detail panel */}
        {selectedScore && wardInsights && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedScore.wardName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Priority Score: <strong className="text-slate-800 dark:text-slate-200">{selectedScore.score}/100</strong> ·
                  <span className={`ml-1 font-bold ${TIER_STYLES[selectedScore.tier].text}`}>
                    {selectedScore.tier} PRIORITY
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedWardId(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Radar chart */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  5-Factor Radar Analysis
                </h4>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 30]} tick={{ fontSize: 9 }} />
                    <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip formatter={(v, n, { payload }) => [`${v}/${payload?.max || 30}`, payload?.fullLabel || n]} />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="space-y-2 mt-2">
                  {Object.entries(selectedScore.factors).map(([key, val]) => {
                    const fl = FACTOR_LABELS[key];
                    return (
                      <div key={key} className="text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-0.5 font-medium">
                          <span>{fl.label}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{val}/{fl.max} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{fl.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Ward Insights */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Targeted Planning Action Points
                </h4>
                <div className="space-y-3">
                  {wardInsights.map((ins, i) => (
                    <InsightCard key={i} insight={ins} />
                  ))}
                </div>

                {/* Underlying Data Summary */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase text-[10px]">
                    Verified Ward Data Record (Kopargaon)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                    <div>Population: <strong className="text-slate-900 dark:text-white">{selectedScore.population.toLocaleString()}</strong></div>
                    <div>Avg Infra Rating: <strong className="text-slate-900 dark:text-white">{selectedScore.details.avgCondition}/10</strong></div>
                    <div>Citizen Reports: <strong className="text-slate-900 dark:text-white">{selectedScore.details.totalIssues} tickets</strong></div>
                    <div>Pending Tickets: <strong className="text-red-500">{selectedScore.details.unresolvedCount}</strong></div>
                    <div>Delayed Projects: <strong className="text-red-500">{selectedScore.details.delayedCount}</strong></div>
                    <div>Total Projects: <strong className="text-slate-900 dark:text-white">{selectedScore.details.totalProjects}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
