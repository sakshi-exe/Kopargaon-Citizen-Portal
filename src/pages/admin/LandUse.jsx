import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { getWardName, wards } from '../../data/wards.js';
import {
  LANDUSE_TYPES,
  getLanduseColor
} from '../../data/landuse.js';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export default function AdminLandUse() {
  const { state } = useApp();

  const [filterWard, setFilterWard] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selected, setSelected] = useState(null);

  /* ---------------- FILTERED ZONES ---------------- */

  const filtered = state.landUseZones.filter((z) => {
    const matchWard =
      filterWard === 'All' || z.wardId === filterWard;

    const matchType =
      filterType === 'All' || z.type === filterType;

    return matchWard && matchType;
  });

  /* ---------------- PIE CHART DATA ---------------- */

  const areaByType = {};

  state.landUseZones.forEach((z) => {
    areaByType[z.type] =
      (areaByType[z.type] || 0) + z.area;
  });

  const pieData = Object.entries(areaByType).map(
    ([name, value]) => ({
      name,
      value: Math.round(value * 10) / 10
    })
  );

  /* ---------------- BAR CHART DATA ---------------- */

  const zonesByWard = {};

  state.landUseZones.forEach((z) => {
    zonesByWard[z.wardId] =
      (zonesByWard[z.wardId] || 0) + 1;
  });

  const wardBarData = wards.map((w) => ({
    ward: w.shortName,
    zones: zonesByWard[w.id] || 0
  }));

  /* ---------------- CUSTOM PIE LABEL ---------------- */

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value
  }) => {
    const RADIAN = Math.PI / 180;

    const radius = outerRadius + 24;

    const x =
      cx + radius * Math.cos(-midAngle * RADIAN);

    const y =
      cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[10px] font-semibold"
      >
        {name}: {value} km²
      </text>
    );
  };

  /* ---------------- CUSTOM TOOLTIP ---------------- */

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const item = payload[0];

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg px-3 py-2">
        <div className="text-xs font-bold text-slate-800 dark:text-white">
          {item.name}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
          Area: {item.value} km²
        </div>
      </div>
    );
  };

  /* ---------------- BAR TOOLTIP ---------------- */

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg px-3 py-2">
        <div className="text-xs font-bold text-slate-800 dark:text-white">
          {label}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
          Zones: {payload[0].value}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ---------------- HEADER ---------------- */}

      <Header
        title="Land-Use Planning"
        subtitle={`${filtered.length} of ${state.landUseZones.length} zones`}
      />

      <div className="flex-1 overflow-y-auto">

        {/* =====================================================
            CHART SECTION
        ===================================================== */}

        <div className="grid md:grid-cols-2 gap-5 p-6 pb-0">

          {/* ================= PIE CHART ================= */}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Land Use Distribution by Area (km²)
            </h3>

            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
              Total area distribution across Kopargaon
            </p>

            <div className="w-full">

              <ResponsiveContainer
                width="100%"
                height={270}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="43%"
                    innerRadius={42}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="white"
                    strokeWidth={2}
                    label={renderPieLabel}
                    labelLine={{
                      stroke: '#94a3b8',
                      strokeWidth: 1
                    }}
                  >

                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getLanduseColor(entry.name)}
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    content={<CustomPieTooltip />}
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '11px',
                      paddingTop: '8px'
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>
          </div>


          {/* ================= BAR CHART ================= */}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Zones per Ward
            </h3>

            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
              Number of registered land-use zones in each ward
            </p>

            <ResponsiveContainer
              width="100%"
              height={270}
            >

              <BarChart
                data={wardBarData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#cbd5e1"
                />

                <XAxis
                  dataKey="ward"
                  tick={{
                    fontSize: 10,
                    fill: '#64748b'
                  }}
                  tickLine={false}
                  axisLine={{
                    stroke: '#cbd5e1'
                  }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={65}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: '#64748b'
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{
                    fill: 'rgba(148,163,184,0.12)'
                  }}
                />

                <Bar
                  dataKey="zones"
                  name="Zones"
                  fill="#16a34a"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={32}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="px-6 py-3 flex flex-wrap gap-3">

          <select
            value={filterWard}
            onChange={(e) =>
              setFilterWard(e.target.value)
            }
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >

            <option value="All">
              All Wards
            </option>

            {wards.map((w) => (
              <option
                key={w.id}
                value={w.id}
              >
                {w.name}
              </option>
            ))}

          </select>


          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >

            <option value="All">
              All Types
            </option>

            {LANDUSE_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}

          </select>

        </div>


        {/* =====================================================
            ZONE GRID
        ===================================================== */}

        <div className="px-6 pb-6 grid md:grid-cols-2 xl:grid-cols-3 gap-3">

          {filtered.map((zone) => (

            <div
              key={zone.id}
              onClick={() => setSelected(zone)}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md cursor-pointer transition-all hover:border-teal-300 dark:hover:border-teal-700"
            >

              <div className="flex items-start justify-between gap-2 mb-2">

                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {zone.name}
                </h3>

                <span
                  className="px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap"
                  style={{
                    background:
                      getLanduseColor(zone.type) + '30',
                    color:
                      getLanduseColor(zone.type)
                  }}
                >
                  {zone.type}
                </span>

              </div>


              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">

                <div>
                  📍 {getWardName(zone.wardId)}
                </div>

                <div>
                  📐 {zone.area} km²
                </div>

                {zone.population && (
                  <div>
                    👥 Pop: {zone.population.toLocaleString()}
                  </div>
                )}

                <div>
                  🔨 {zone.developmentStatus}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          ZONE DETAILS MODAL
      ===================================================== */}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || ''}
        size="md"
      >

        {selected && (

          <div className="space-y-3 text-sm">

            <div className="grid grid-cols-2 gap-3">

              {[
                ['Zone ID', selected.id],
                ['Type', selected.type],
                ['Ward', getWardName(selected.wardId)],
                ['Area', `${selected.area} km²`],
                ['Dev. Status', selected.developmentStatus],
                [
                  'Population',
                  selected.population
                    ? selected.population.toLocaleString()
                    : 'N/A'
                ]
              ].map(([key, value]) => (

                <div key={key}>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {key}
                  </div>

                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {value}
                  </div>

                </div>

              ))}

            </div>


            {selected.notes && (

              <div className="mt-2">

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Planning Notes
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selected.notes}
                </p>

              </div>

            )}

          </div>

        )}

      </Modal>

    </div>
  );
}