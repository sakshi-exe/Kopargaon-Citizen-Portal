import React, { useMemo, useState } from 'react';
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
  Search,
  IndianRupee,
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FolderOpen,
  WalletCards,
  Activity,
  Eye,
  X,
} from 'lucide-react';

export default function CitizenTransparency() {
  const { state, dispatch } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  /*
   * =========================================================
   * SAFE DATA
   * =========================================================
   */

  const publicProjects = Array.isArray(state?.projects)
    ? state.projects
    : [];

  const infrastructure = Array.isArray(
    state?.infrastructure
  )
    ? state.infrastructure
    : [];

  /*
   * =========================================================
   * SUMMARY CALCULATIONS
   * =========================================================
   */

  const completedCount = publicProjects.filter(
    (project) =>
      project?.status === 'Completed'
  ).length;

  const totalBudget = publicProjects.reduce(
    (sum, project) =>
      sum + (Number(project?.budget) || 0),
    0
  );

  const totalSpent = publicProjects.reduce(
    (sum, project) =>
      sum + (Number(project?.spent) || 0),
    0
  );

  const overallUtilisation =
    totalBudget > 0
      ? Math.round(
          (totalSpent / totalBudget) * 100
        )
      : 0;

  /*
   * =========================================================
   * FILTERS
   * =========================================================
   */

  const statuses = [
    'All',
    'In Progress',
    'Completed',
    'Delayed',
    'Approved',
    'Planned',
  ];

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return publicProjects.filter((project) => {
      const searchableText = [
        project?.name,
        project?.id,
        project?.contractor,
        project?.department,
        project?.category,
        project?.wardId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesStatus =
        filterStatus === 'All' ||
        project?.status === filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    publicProjects,
    search,
    filterStatus,
  ]);

  /*
   * =========================================================
   * OPEN QR / INFRASTRUCTURE PROFILE
   * =========================================================
   */

  const handleOpenAsset = (project) => {
    if (!project) return;

    const existingAsset =
      infrastructure.find(
        (asset) =>
          asset?.id === project?.qrAssetRef
      );

    const fallbackAsset = {
      id:
        project?.qrAssetRef ||
        project?.id,
      name:
        project?.name ||
        'Civic Infrastructure Asset',
      type:
        project?.category ||
        'Infrastructure',
      wardId:
        project?.wardId ||
        null,
      condition:
        project?.status === 'Completed'
          ? 9
          : 6,
      installDate:
        project?.startDate ||
        '—',
      lastInspection:
        project?.expectedEnd ||
        '—',
      maintenanceStatus:
        project?.status === 'Completed'
          ? 'Up-to-date'
          : 'Due',
      contractor:
        project?.contractor ||
        'Municipal Works Department',
      budget:
        Number(project?.budget) || 0,
      citizenReports: 0,
      description:
        project?.description ||
        'Public civic infrastructure project record.',
      maintenanceHistory:
        Array.isArray(project?.updates)
          ? project.updates.map(
              (update) => ({
                date:
                  update?.date ||
                  '—',
                action:
                  update?.text ||
                  'Project update recorded.',
              })
            )
          : [],
    };

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload:
        existingAsset ||
        fallbackAsset,
    });
  };

  /*
   * =========================================================
   * NO PROJECT DATA
   * =========================================================
   */

  if (publicProjects.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">

        <Header
          title="Kopargaon Planning & Infrastructure Transparency"
          subtitle="Open public register — Know what is behind your city's infrastructure"
        />

        <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6">

          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">

              <FolderOpen
                size={28}
                className="text-teal-600"
              />

            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              Public project register is empty
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Civic projects published by Kopargaon
              authorities will appear here with
              budgets, progress, expenditure and
              infrastructure verification records.
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
   * =========================================================
   * MAIN UI
   * =========================================================
   */

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header
        title="Kopargaon Planning & Infrastructure Transparency"
        subtitle="Open public register — Know what is behind your city's infrastructure"
      />

      <div className="flex-1 overflow-y-auto">

        {/* ===================================================
            INTRODUCTION
        ==================================================== */}

        <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-green-50 p-5 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">

                <ShieldCheck
                  size={25}
                  className="text-emerald-600"
                />

              </div>

              <div className="min-w-0">

                <div className="mb-1 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Public Record
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <CheckCircle2 size={12} />
                    Verification-enabled
                  </span>

                </div>

                <h2 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Know What Is Behind Your Infrastructure
                </h2>

                <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600 sm:text-sm">
                  CivicFix brings municipal project
                  information into one public register.
                  Citizens can review project budgets,
                  expenditure, execution progress,
                  contractors and associated infrastructure
                  verification records.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            SUMMARY STATS
        ==================================================== */}

        <section className="px-4 pt-5 sm:px-6">

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            {/* Projects */}

            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                  <FolderOpen
                    size={19}
                    className="text-blue-600"
                  />

                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Projects
                </span>

              </div>

              <div className="mt-3 text-2xl font-black text-slate-900">
                {publicProjects.length}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">
                Published public works
              </div>

            </div>

            {/* Completed */}

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                  <CheckCircle2
                    size={19}
                    className="text-emerald-600"
                  />

                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Completed
                </span>

              </div>

              <div className="mt-3 text-2xl font-black text-slate-900">
                {completedCount}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">
                Verified completed projects
              </div>

            </div>

            {/* Budget */}

            <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">

                  <WalletCards
                    size={19}
                    className="text-amber-600"
                  />

                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Approved
                </span>

              </div>

              <div className="mt-3 text-xl font-black text-slate-900">
                {formatCurrency(totalBudget)}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">
                Total approved budget
              </div>

            </div>

            {/* Expenditure */}

            <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">

                  <Activity
                    size={19}
                    className="text-teal-600"
                  />

                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Utilised
                </span>

              </div>

              <div className="mt-3 text-xl font-black text-slate-900">
                {formatCurrency(totalSpent)}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">
                {overallUtilisation}% of approved budget
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            SEARCH + FILTER
        ==================================================== */}

        <section className="px-4 pt-5 sm:px-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}

              <div className="relative w-full max-w-xl">

                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search project, contractor, department or ID..."
                  aria-label="Search transparency records"
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-10
                    text-sm font-medium text-slate-900
                    placeholder:text-slate-400
                    focus:border-teal-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-teal-500/20
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch('')
                    }
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              {/* Status filters */}

              <div className="flex max-w-full gap-1.5 overflow-x-auto pb-1">

                {statuses.map((status) => {

                  const active =
                    filterStatus === status;

                  return (
                    <button
                      type="button"
                      key={status}
                      onClick={() =>
                        setFilterStatus(status)
                      }
                      className={`
                        flex-shrink-0
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-bold
                        transition-all
                        ${
                          active
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      {status}
                    </button>
                  );
                })}

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            REGISTER
        ==================================================== */}

        <section className="p-4 sm:p-6">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Register header */}

            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">

                    <CheckCircle2
                      size={17}
                      className="text-emerald-600"
                    />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-slate-900">
                      Municipal Project & QR Audit Register
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {filteredProjects.length} public record
                      {filteredProjects.length !== 1
                        ? 's'
                        : ''}{' '}
                      available
                    </p>

                  </div>

                </div>

                <div className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">

                  <ShieldCheck
                    size={12}
                    className="text-emerald-500"
                  />

                  Public verification enabled

                </div>

              </div>

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1050px] text-xs">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">

                    <th className="px-5 py-3.5">
                      Project & Asset ID
                    </th>

                    <th className="px-4 py-3.5">
                      Ward / Location
                    </th>

                    <th className="px-4 py-3.5">
                      Contractor
                    </th>

                    <th className="px-4 py-3.5">
                      Budget
                    </th>

                    <th className="px-4 py-3.5">
                      Target
                    </th>

                    <th className="px-4 py-3.5">
                      Progress
                    </th>

                    <th className="px-4 py-3.5">
                      Status
                    </th>

                    <th className="px-4 py-3.5">
                      Audit
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredProjects.map(
                    (project) => (

                      <tr
                        key={project.id}
                        className="transition-colors hover:bg-slate-50"
                      >

                        {/* Project */}

                        <td className="px-5 py-4">

                          <div className="max-w-[240px]">

                            <div className="line-clamp-2 font-bold text-slate-900">
                              {project.name ||
                                'Unnamed Project'}
                            </div>

                            <div className="mt-1 font-mono text-[10px] font-bold text-blue-600">
                              {project.id}
                            </div>

                          </div>

                        </td>

                        {/* Location */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5 whitespace-nowrap font-medium text-slate-700">

                            <MapPin
                              size={12}
                              className="text-teal-500"
                            />

                            {getWardName(
                              project.wardId
                            ) ||
                              project.wardId ||
                              'Ward not specified'}

                          </div>

                        </td>

                        {/* Contractor */}

                        <td className="max-w-[180px] px-4 py-4">

                          <div className="truncate text-slate-700">

                            {project.contractor ||
                              'KMC Engineering Div'}

                          </div>

                        </td>

                        {/* Budget */}

                        <td className="px-4 py-4">

                          <div className="whitespace-nowrap font-bold text-slate-900">
                            {formatCurrency(
                              project.budget || 0
                            )}
                          </div>

                          <div className="mt-0.5 whitespace-nowrap text-[10px] text-slate-400">

                            Utilised:{' '}

                            {getBudgetUtilization(
                              project.spent || 0,
                              project.budget || 0
                            )}
                            %

                          </div>

                        </td>

                        {/* Target */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-600">

                            <Calendar size={12} />

                            {formatDate(
                              project.expectedEnd
                            )}

                          </div>

                        </td>

                        {/* Progress */}

                        <td className="w-32 px-4 py-4">

                          <ProgressBar
                            value={
                              Number(
                                project.progress
                              ) || 0
                            }
                            color="auto"
                            size="sm"
                            showLabel
                          />

                        </td>

                        {/* Status */}

                        <td className="px-4 py-4">

                          <StatusBadge
                            status={
                              project.status ||
                              'Planned'
                            }
                          />

                        </td>

                        {/* Audit */}

                        <td className="px-4 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenAsset(
                                project
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              whitespace-nowrap
                              rounded-lg
                              border
                              border-blue-100
                              bg-blue-50
                              px-3
                              py-2
                              font-bold
                              text-blue-700
                              transition-colors
                              hover:border-blue-200
                              hover:bg-blue-100
                            "
                          >

                            <QrCode size={13} />

                            View Profile

                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================== */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredProjects.map(
                (project) => (

                  <article
                    key={project.id}
                    className="p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <div className="font-bold leading-5 text-slate-900">
                          {project.name ||
                            'Unnamed Project'}
                        </div>

                        <div className="mt-1 font-mono text-[10px] font-bold text-blue-600">
                          {project.id}
                        </div>

                      </div>

                      <StatusBadge
                        status={
                          project.status ||
                          'Planned'
                        }
                      />

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Ward
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700">

                          <MapPin
                            size={12}
                            className="text-teal-500"
                          />

                          <span className="truncate">
                            {getWardName(
                              project.wardId
                            ) ||
                              project.wardId ||
                              'Not specified'}
                          </span>

                        </div>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Budget
                        </div>

                        <div className="mt-1 text-xs font-black text-slate-800">
                          {formatCurrency(
                            project.budget || 0
                          )}
                        </div>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Target
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700">

                          <Calendar size={12} />

                          {formatDate(
                            project.expectedEnd
                          )}

                        </div>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Contractor
                        </div>

                        <div className="mt-1 truncate text-xs font-bold text-slate-700">
                          {project.contractor ||
                            'KMC Engineering Div'}
                        </div>

                      </div>

                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">

                      <ProgressBar
                        value={
                          Number(
                            project.progress
                          ) || 0
                        }
                        color="auto"
                        size="sm"
                        showLabel
                        label="Execution Progress"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenAsset(
                          project
                        )
                      }
                      className="
                        mt-3
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-blue-700
                        transition-colors
                        hover:bg-blue-100
                      "
                    >

                      <QrCode size={14} />

                      View QR Infrastructure Profile

                      <Eye size={13} />

                    </button>

                  </article>
                )
              )}

            </div>

            {/* =================================================
                EMPTY FILTER STATE
            ================================================== */}

            {filteredProjects.length === 0 && (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                  <Search
                    size={24}
                    className="text-slate-400"
                  />

                </div>

                <h3 className="mt-4 text-base font-black text-slate-900">
                  No matching public records
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or status
                  filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilterStatus('All');
                  }}
                  className="mt-4 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            FOOTER TRUST MESSAGE
        ==================================================== */}

        <section className="px-4 pb-6 sm:px-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600"
                />

              </div>

              <div>

                <h4 className="text-xs font-black text-slate-800">
                  Built for public accountability
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  CivicFix connects project-level
                  information with infrastructure-level
                  verification so citizens can move from
                  a project record to the physical asset
                  behind it.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}