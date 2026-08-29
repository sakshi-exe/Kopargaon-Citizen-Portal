import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import {
  formatDate,
  formatCurrency,
  getBudgetUtilization,
} from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';

import {
  Eye,
  IndianRupee,
  Calendar,
  MapPin,
  CheckCircle,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

export default function CitizenTransparency() {
  const { state, dispatch } = useApp();

  const publicProjects = state.projects;

  const completedCount = publicProjects.filter(
    (p) => p.status === 'Completed'
  ).length;

  const totalBudget = publicProjects.reduce(
    (s, p) => s + p.budget,
    0
  );

  const totalSpent = publicProjects.reduce(
    (s, p) => s + p.spent,
    0
  );

  const handleOpenAsset = (p) => {
    const asset =
      state.infrastructure.find(
        (i) => i.id === p.qrAssetRef
      ) || {
        id: p.id,
        name: p.name,
        type: p.category,
        wardId: p.wardId,
        condition:
          p.status === 'Completed' ? 9 : 6,
        installDate: p.startDate,
        lastInspection: p.expectedEnd,
        maintenanceStatus:
          p.status === 'Completed'
            ? 'Up-to-date'
            : 'Due',
        contractor: p.contractor,
        budget: p.budget,
        citizenReports: 0,
        description: p.description,
        maintenanceHistory: p.updates
          ? p.updates.map((u) => ({
              date: u.date,
              action: u.text,
            }))
          : [],
      };

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload: asset,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header
        title="Kopargaon Planning & Infrastructure Transparency"
        subtitle="Open public register — Know what is behind your city's infrastructure"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60">

        {/* =====================================================
            TRANSPARENCY BANNER
        ====================================================== */}

        <div
          className="
            p-6
            rounded-2xl
            bg-gradient-to-r
            from-blue-50
            via-white
            to-teal-50
            border
            border-slate-200
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-gradient-to-br
                from-blue-100
                to-teal-100
                border
                border-teal-200
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <ShieldCheck
                size={26}
                className="text-teal-600"
              />
            </div>

            <div>

              <h2
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Know What Is Behind Your Infrastructure
              </h2>

              <p
                className="
                  text-xs
                  sm:text-sm
                  text-slate-600
                  mt-1
                  leading-relaxed
                  max-w-3xl
                "
              >
                CivicFix ensures full municipal accountability
                in Kopargaon. Every citizen can inspect who built
                a road or drain, what project funded it, approved
                budget vs expenditure, current condition score,
                verified field inspections, and full maintenance
                history.
              </p>

            </div>
          </div>
        </div>


        {/* =====================================================
            SUMMARY STATS
        ====================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            {
              label: 'Published Public Works',
              value: publicProjects.length,
              icon: '📋',
              iconBg: 'bg-blue-50',
              border: 'border-blue-100',
            },
            {
              label: 'Verified Completed',
              value: completedCount,
              icon: '✅',
              iconBg: 'bg-emerald-50',
              border: 'border-emerald-100',
            },
            {
              label: 'Total Approved Budget',
              value: formatCurrency(totalBudget),
              icon: '💰',
              iconBg: 'bg-amber-50',
              border: 'border-amber-100',
            },
            {
              label: 'Expenditure Utilised',
              value: formatCurrency(totalSpent),
              icon: '📊',
              iconBg: 'bg-teal-50',
              border: 'border-teal-100',
            },
          ].map((s) => (

            <div
              key={s.label}
              className={`
                bg-white
                rounded-2xl
                border
                ${s.border}
                p-4
                text-center
                shadow-sm
                hover:shadow-md
                transition-shadow
              `}
            >

              <div
                className={`
                  w-10
                  h-10
                  mx-auto
                  rounded-xl
                  ${s.iconBg}
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-2
                `}
              >
                {s.icon}
              </div>

              <div
                className="
                  text-xl
                  font-extrabold
                  text-slate-900
                "
              >
                {s.value}
              </div>

              <div
                className="
                  text-xs
                  text-slate-500
                  mt-0.5
                "
              >
                {s.label}
              </div>

            </div>

          ))}

        </div>


        {/* =====================================================
            PROJECT & ASSET REGISTER
        ====================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            overflow-hidden
            shadow-sm
          "
        >

          {/* Table Header */}

          <div
            className="
              px-6
              py-4
              border-b
              border-slate-200
              flex
              flex-wrap
              items-center
              justify-between
              gap-2
              bg-white
            "
          >

            <div className="flex items-center gap-2">

              <div
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-emerald-50
                  border
                  border-emerald-100
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle
                  size={16}
                  className="text-emerald-500"
                />
              </div>

              <h3
                className="
                  font-bold
                  text-slate-900
                  text-sm
                "
              >
                Kopargaon Municipal Project & QR Audit Register
              </h3>

            </div>

            <span
              className="
                text-xs
                text-slate-500
                bg-slate-50
                border
                border-slate-200
                px-2.5
                py-1
                rounded-lg
              "
            >
              Updated August 2026
            </span>

          </div>


          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full text-xs">

              <thead>

                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    text-slate-500
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[10px]
                  "
                >

                  <th className="text-left px-5 py-3.5">
                    Project & Asset ID
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Ward / Location
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Contractor
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Budget & DPR
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Completion Target
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Progress
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Status
                  </th>

                  <th className="text-left px-4 py-3.5">
                    Public Audit
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {publicProjects.map((p) => (

                  <tr
                    key={p.id}
                    className="
                      hover:bg-slate-50
                      transition-colors
                    "
                  >

                    {/* Project */}

                    <td className="px-5 py-3.5">

                      <div
                        className="
                          font-bold
                          text-slate-900
                          text-xs
                        "
                      >
                        {p.name}
                      </div>

                      <div
                        className="
                          text-[10px]
                          font-mono
                          text-blue-600
                          mt-0.5
                        "
                      >
                        {p.id}
                      </div>

                    </td>


                    {/* Location */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          text-slate-700
                          font-medium
                        "
                      >

                        <MapPin
                          size={12}
                          className="text-teal-500"
                        />

                        {getWardName(p.wardId)}

                      </div>

                    </td>


                    {/* Contractor */}

                    <td
                      className="
                        px-4
                        py-3.5
                        max-w-[150px]
                        truncate
                        text-slate-700
                      "
                    >
                      {p.contractor ||
                        'KMC Engineering Div'}
                    </td>


                    {/* Budget */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <div
                        className="
                          font-bold
                          text-slate-900
                        "
                      >
                        {formatCurrency(p.budget)}
                      </div>

                      <div
                        className="
                          text-[10px]
                          text-slate-400
                        "
                      >
                        Utilised:{' '}
                        {getBudgetUtilization(
                          p.spent,
                          p.budget
                        )}
                        %
                      </div>

                    </td>


                    {/* Completion */}

                    <td
                      className="
                        px-4
                        py-3.5
                        whitespace-nowrap
                        text-slate-600
                      "
                    >

                      <div className="flex items-center gap-1">

                        <Calendar size={11} />

                        {formatDate(
                          p.expectedEnd
                        )}

                      </div>

                    </td>


                    {/* Progress */}

                    <td className="px-4 py-3.5 w-28">

                      <ProgressBar
                        value={p.progress}
                        color="auto"
                        size="sm"
                        showLabel
                      />

                    </td>


                    {/* Status */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <StatusBadge
                        status={p.status}
                      />

                    </td>


                    {/* Public Audit */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <button
                        onClick={() =>
                          handleOpenAsset(p)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1
                          px-2.5
                          py-1.5
                          rounded-lg
                          bg-blue-50
                          hover:bg-blue-100
                          border
                          border-blue-100
                          text-blue-700
                          font-semibold
                          transition-colors
                        "
                      >

                        <QrCode size={12} />

                        View Profile

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