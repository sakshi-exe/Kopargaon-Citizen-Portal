import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import {
  VideoEvidencePlayer,
} from '../../components/ui/VideoEvidencePlayer.jsx';

import {
  formatDate,
  formatCurrency,
  getBudgetUtilization,
} from '../../utils/formatters.js';

import { getWardName } from '../../data/wards.js';

import {
  Search,
  MapPin,
  Calendar,
  IndianRupee,
  QrCode,
  ShieldCheck,
  Video,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  FolderOpen,
  X,
} from 'lucide-react';

export default function CitizenProjects() {
  const { state, dispatch } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  /*
   * =========================================================
   * SAFE PROJECT DATA
   * =========================================================
   */

  const projects = Array.isArray(state?.projects)
    ? state.projects
    : [];

  /*
   * =========================================================
   * STATUS FILTERS
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

  /*
   * =========================================================
   * FILTER PROJECTS
   * =========================================================
   */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const searchableText = [
        project?.name,
        project?.id,
        project?.department,
        project?.contractor,
        project?.category,
        project?.wardId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        filterStatus === 'All' ||
        project?.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filterStatus]);

  /*
   * =========================================================
   * OPEN QR / ASSET PROFILE
   * =========================================================
   */

  const handleOpenQRProfile = (project) => {
    if (!project) return;

    setSelectedProject(null);

    const infrastructure =
      Array.isArray(state?.infrastructure)
        ? state.infrastructure
        : [];

    const existingAsset = infrastructure.find(
      (asset) =>
        asset?.id === project?.qrAssetRef
    );

    const fallbackAsset = {
      id: project?.qrAssetRef || project?.id,
      name:
        project?.name ||
        'Civic Infrastructure Asset',
      type:
        project?.category ||
        'Infrastructure',
      wardId: project?.wardId || null,
      condition:
        project?.status === 'Completed'
          ? 9
          : 6,
      installDate:
        project?.startDate || '—',
      lastInspection:
        project?.expectedEnd || '—',
      maintenanceStatus:
        project?.status === 'Completed'
          ? 'Up-to-date'
          : 'Due',
      contractor:
        project?.contractor ||
        'Municipal Works Department',
      budget:
        project?.budget || 0,
      citizenReports: 0,
      description:
        project?.description ||
        'Public civic infrastructure project record.',
      maintenanceHistory:
        Array.isArray(project?.updates)
          ? project.updates.map((update) => ({
              date: update?.date || '—',
              action:
                update?.text ||
                'Project update recorded.',
            }))
          : [],
    };

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload:
        existingAsset || fallbackAsset,
    });
  };

  /*
   * =========================================================
   * PROJECT STATUS SUMMARY
   * =========================================================
   */

  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (project) => project?.status === 'Completed'
  ).length;

  const activeProjects = projects.filter(
    (project) => project?.status === 'In Progress'
  ).length;

  /*
   * =========================================================
   * EMPTY DATA STATE
   * =========================================================
   */

  if (totalProjects === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">

        <Header
          title="Kopargaon Development Projects"
          subtitle="Public monitoring of civic infrastructure and verified progress evidence"
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          <div className="mx-auto flex min-h-[420px] max-w-3xl items-center justify-center">

            <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
                <FolderOpen
                  size={28}
                  className="text-teal-600"
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                No projects available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Development projects published by Kopargaon
                civic authorities will appear here with their
                progress, budget and verification details.
              </p>

            </div>

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
        title="Kopargaon Development Projects"
        subtitle="Public monitoring of civic infrastructure and verified progress evidence"
      />

      <div className="flex-1 overflow-y-auto">

        {/* ===================================================
            SUMMARY STRIP
        ==================================================== */}

        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">

          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Total Projects
              </div>

              <div className="mt-1 text-xl font-black text-slate-900">
                {totalProjects}
              </div>

            </div>

            <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3">

              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                In Progress
              </div>

              <div className="mt-1 text-xl font-black text-teal-600">
                {activeProjects}
              </div>

            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">

              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Completed
              </div>

              <div className="mt-1 text-xl font-black text-emerald-600">
                {completedProjects}
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            FILTER BAR
        ==================================================== */}

        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

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
                aria-label="Search development projects"
                className="
                  w-full rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-3 pl-10 pr-10
                  text-sm font-medium text-slate-900
                  placeholder:text-slate-400
                  transition-all
                  focus:border-teal-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-500/20
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear project search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            {/* Status Filters */}

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
                      flex-shrink-0 rounded-lg
                      px-3 py-2
                      text-xs font-bold
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

        {/* ===================================================
            RESULTS INFO
        ==================================================== */}

        <div className="px-4 pt-5 sm:px-6">

          <div className="flex items-center justify-between gap-3">

            <div>
              <h2 className="text-base font-black text-slate-900">
                Public Projects
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {filteredProjects.length} project
                {filteredProjects.length !== 1
                  ? 's'
                  : ''}{' '}
                matching your filters
              </p>
            </div>

            <div className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-600 sm:flex">
              <ShieldCheck size={14} />
              Publicly verifiable
            </div>

          </div>

        </div>

        {/* ===================================================
            PROJECT CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => {

            const wardName =
              getWardName(project?.wardId) ||
              project?.wardId ||
              'Ward not specified';

            return (
              <article
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setSelectedProject(project)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ' '
                  ) {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="
                  group flex cursor-pointer
                  flex-col justify-between
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-teal-300
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-500/30
                "
              >

                <div className="p-5">

                  {/* Project Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-blue-600">
                        {project.id}
                      </span>

                      <h3 className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-900 transition-colors group-hover:text-teal-600">
                        {project.name ||
                          'Unnamed Civic Project'}
                      </h3>

                    </div>

                    <div className="flex-shrink-0">
                      <StatusBadge
                        status={
                          project.status || 'Planned'
                        }
                      />
                    </div>

                  </div>

                  {/* Project Information */}

                  <div className="my-4 space-y-2.5 text-xs text-slate-600">

                    <div className="flex items-start gap-2">

                      <MapPin
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-teal-500"
                      />

                      <span>
                        {wardName}
                        {' · '}
                        Kopargaon
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <IndianRupee
                        size={14}
                        className="flex-shrink-0 text-slate-400"
                      />

                      <span>
                        Budget:{' '}
                        <strong className="text-slate-800">
                          {formatCurrency(
                            project.budget || 0
                          )}
                        </strong>
                      </span>

                    </div>

                    <div className="flex items-start gap-2">

                      <Calendar
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-slate-400"
                      />

                      <span>
                        {formatDate(
                          project.startDate
                        )}
                        {' → '}
                        {formatDate(
                          project.expectedEnd
                        )}
                      </span>

                    </div>

                    {project.contractor && (
                      <div className="flex items-start gap-2">

                        <Building2
                          size={14}
                          className="mt-0.5 flex-shrink-0 text-slate-400"
                        />

                        <span className="min-w-0 truncate">
                          Contractor:{' '}
                          <strong className="text-slate-700">
                            {project.contractor}
                          </strong>
                        </span>

                      </div>
                    )}

                  </div>

                  {/* Progress */}

                  <div>
                    <ProgressBar
                      value={
                        Number(project.progress) || 0
                      }
                      color="auto"
                      size="sm"
                      showLabel
                      label="Execution Progress"
                    />
                  </div>

                  {/* Description */}

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {project.description ||
                      'No public project description has been published yet.'}
                  </p>

                </div>

                {/* Card Footer */}

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">

                  <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-bold text-teal-600">
                    <Video
                      size={13}
                      className="flex-shrink-0"
                    />

                    <span className="truncate">
                      Video Evidence Available
                    </span>
                  </span>

                  <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-bold text-slate-700 transition-colors group-hover:text-teal-600">
                    Details
                    <ArrowRight size={13} />
                  </span>

                </div>

              </article>
            );
          })}

          {/* =================================================
              EMPTY SEARCH STATE
          ================================================== */}

          {filteredProjects.length === 0 && (
            <div className="col-span-full flex min-h-[300px] items-center justify-center">

              <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Search
                    size={24}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900">
                  No matching projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Try another project name, ID,
                  contractor or status filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilterStatus('All');
                  }}
                  className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-700"
                >
                  Clear Filters
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          PROJECT DETAILS MODAL
      ====================================================== */}

      <Modal
        isOpen={!!selectedProject}
        onClose={() =>
          setSelectedProject(null)
        }
        title={
          selectedProject?.name ||
          'Project Details & Evidence'
        }
        size="xl"
      >

        {selectedProject && (
          <div className="space-y-6">

            {/* =================================================
                VERIFICATION HEADER
            ================================================== */}

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-green-50 p-5">

              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="min-w-0">

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-600">
                      {selectedProject.id}
                    </span>

                    <StatusBadge
                      status={
                        selectedProject.status ||
                        'Planned'
                      }
                    />

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <ShieldCheck size={14} />
                      KMC Verified Project
                    </span>

                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {selectedProject.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                    <MapPin
                      size={14}
                      className="text-teal-500"
                    />

                    <span>
                      {getWardName(
                        selectedProject.wardId
                      ) ||
                        selectedProject.wardId ||
                        'Ward not specified'}
                      , Kopargaon,
                      Maharashtra
                    </span>

                  </div>

                </div>

                {/* Budget */}

                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 md:text-right">

                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Approved Budget
                  </div>

                  <div className="mt-1 text-xl font-black text-slate-900">
                    {formatCurrency(
                      selectedProject.budget || 0
                    )}
                  </div>

                  <div className="mt-0.5 text-[11px] font-bold text-teal-600">
                    {getBudgetUtilization(
                      selectedProject.spent || 0,
                      selectedProject.budget || 0
                    )}
                    % Utilised
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                PROJECT METRICS
            ================================================== */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                <div className="text-[10px] font-semibold uppercase text-slate-400">
                  Department
                </div>

                <div className="mt-1 truncate text-xs font-bold text-slate-800">
                  {selectedProject.department ||
                    'Municipal Works'}
                </div>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                <div className="text-[10px] font-semibold uppercase text-slate-400">
                  Contractor
                </div>

                <div className="mt-1 truncate text-xs font-bold text-slate-800">
                  {selectedProject.contractor ||
                    'KMC PWD'}
                </div>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                <div className="text-[10px] font-semibold uppercase text-slate-400">
                  Commencement
                </div>

                <div className="mt-1 text-xs font-bold text-slate-800">
                  {formatDate(
                    selectedProject.startDate
                  )}
                </div>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                <div className="text-[10px] font-semibold uppercase text-slate-400">
                  Target Completion
                </div>

                <div className="mt-1 text-xs font-bold text-slate-800">
                  {formatDate(
                    selectedProject.expectedEnd
                  )}
                </div>

              </div>

            </div>

            {/* =================================================
                PROGRESS
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-700">

                <span>
                  Execution & Delivery Progress
                </span>

                <span className="text-teal-600">
                  {Number(
                    selectedProject.progress
                  ) || 0}
                  % Complete
                </span>

              </div>

              <ProgressBar
                value={
                  Number(
                    selectedProject.progress
                  ) || 0
                }
                color="auto"
                size="md"
              />

            </div>

            {/* =================================================
                PROJECT DESCRIPTION
            ================================================== */}

            {selectedProject.description && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Project Description
                </h4>

                <p className="text-sm leading-6 text-slate-600">
                  {selectedProject.description}
                </p>

              </div>
            )}

            {/* =================================================
                VIDEO EVIDENCE
            ================================================== */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <Video
                  size={17}
                  className="text-teal-600"
                />

                <h4 className="text-sm font-black text-slate-800">
                  Progress & Verification Evidence
                </h4>

              </div>

              <VideoEvidencePlayer
                title={`${selectedProject.name} — Progress & Verification Audit`}
                projectName={
                  selectedProject.name
                }
                location={`Kopargaon (${
                  getWardName(
                    selectedProject.wardId
                  ) ||
                  selectedProject.wardId ||
                  'Ward'
                }), Maharashtra`}
                date="August 2026"
                verifiedBy={
                  selectedProject.contractor
                    ? `Audited by KMC Inspection Cell · Contractor: ${selectedProject.contractor}`
                    : 'KMC Quality Audit Division'
                }
              />

            </div>

            {/* =================================================
                PROJECT UPDATES
            ================================================== */}

            {Array.isArray(
              selectedProject.updates
            ) &&
              selectedProject.updates.length >
                0 && (
                <div>

                  <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">

                    <Clock size={14} />

                    Project Execution Timeline

                  </h4>

                  <div className="ml-2 space-y-4 border-l-2 border-slate-200 pl-5">

                    {selectedProject.updates.map(
                      (update, index) => (
                        <div
                          key={`${update?.date || 'update'}-${index}`}
                          className="relative"
                        >

                          <div className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-teal-500 shadow-sm" />

                          <div className="text-xs">

                            <span className="font-bold text-slate-700">
                              {formatDate(
                                update?.date
                              )}
                            </span>

                            <p className="mt-1 leading-5 text-slate-600">
                              {update?.text ||
                                'Project update recorded.'}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* =================================================
                PUBLIC VERIFICATION NOTE
            ================================================== */}

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-100">

                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h4 className="text-xs font-black text-emerald-800">
                    Public verification record
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                    Project progress, execution updates
                    and associated infrastructure records
                    are presented for public transparency.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={() =>
                  handleOpenQRProfile(
                    selectedProject
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                <QrCode size={15} />

                View Associated QR Asset Profile

              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedProject(null)
                }
                className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-teal-700"
              >
                Done
              </button>

            </div>

          </div>
        )}

      </Modal>
    </div>
  );
}