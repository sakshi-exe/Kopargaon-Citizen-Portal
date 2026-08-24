import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { getWardName } from '../../data/wards.js';
import { LANDUSE_TYPES, LANDUSE_COLORS, getLanduseColor } from '../../data/landuse.js';
import { wards } from '../../data/wards.js';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Layers } from 'lucide-react';

export default function AdminLandUse() {
  const { state } = useApp();
  const [filterWard, setFilterWard] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = state.landUseZones.filter(z => {
    const matchWard = filterWard === 'All' || z.wardId === filterWard;
    const matchType = filterType === 'All' || z.type === filterType;
    return matchWard && matchType;
  });

  // Analytics: area by type
  const areaByType = {};
  state.landUseZones.forEach(z => {
    areaByType[z.type] = (areaByType[z.type] || 0) + z.area;
  });
  const pieData = Object.entries(areaByType).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

  // Analytics: zones by ward
  const zonesByWard = {};
  state.landUseZones.forEach(z => { zonesByWard[z.wardId] = (zonesByWard[z.wardId] || 0) + 1; });
  const wardBarData = wards.map(w => ({ ward: w.shortName, zones: zonesByWard[w.id] || 0 }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Land-Use Planning" subtitle={`${filtered.length} of ${state.landUseZones.length} zones`} />

      <div className="flex-1 overflow-y-auto">
        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-5 p-6 pb-0">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Land Use Distribution by Area (km²)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name}: ${value}km²`} labelLine={false}>
                  {pieData.map((e, i) => <Cell key={i} fill={getLanduseColor(e.name)} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} km²`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Zones per Ward</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wardBarData} margin={{ left: -20, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="zones" name="Zones" fill="#16a34a" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 flex flex-wrap gap-3">
          <select value={filterWard} onChange={e => setFilterWard(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none">
            <option value="All">All Wards</option>
            {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none">
            <option value="All">All Types</option>
            {LANDUSE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Zone grid */}
        <div className="px-6 pb-6 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(zone => (
            <div key={zone.id} onClick={() => setSelected(zone)}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{zone.name}</h3>
                <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: getLanduseColor(zone.type) + '30', color: getLanduseColor(zone.type) }}>
                  {zone.type}
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div>📍 {getWardName(zone.wardId)}</div>
                <div>📐 {zone.area} km²</div>
                {zone.population && <div>👥 Pop: {zone.population.toLocaleString()}</div>}
                <div>🔨 {zone.developmentStatus}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} size="md">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Zone ID', selected.id], ['Type', selected.type],
                ['Ward', getWardName(selected.wardId)], ['Area', `${selected.area} km²`],
                ['Dev. Status', selected.developmentStatus], ['Population', selected.population ? selected.population.toLocaleString() : 'N/A'],
              ].map(([k, v]) => (
                <div key={k}><div className="text-xs text-slate-500 dark:text-slate-400">{k}</div><div className="font-medium text-slate-800 dark:text-slate-200">{v}</div></div>
              ))}
            </div>
            {selected.notes && (
              <div className="mt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Planning Notes</div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
