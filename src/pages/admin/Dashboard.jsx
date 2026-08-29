import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderOpen,
  MessageSquare,
  AlertTriangle,
  MapPin,
  IndianRupee,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { supabase } from '../../lib/supabase.js';

import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import Header from '../../components/ui/Header.jsx';

import {
  formatCurrency,
  formatDate,
} from '../../utils/formatters.js';

import { getWardName } from '../../data/wards.js';

import {
  computeAllWardPriorities,
  TIER_STYLES,
} from '../../utils/priorityScore.js';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';


/* =========================================================
   HELPERS
========================================================= */

const RESOLVED_STATUSES = [
  'Resolved',
  'Verified',
  'Closed',
];

const normalizeStatus = (status) => {
  if (!status) return 'Reported';

  const value = String(status).toLowerCase();

  if (value === 'pending') {
    return 'Reported';
  }

  if (value === 'under_review') {
    return 'Under Review';
  }

  if (value === 'in_progress') {
    return 'In Progress';
  }

  return status;
};


/* =========================================================
   COMPONENT
========================================================= */

export default function AdminDashboard() {

  const { state } = useApp();
  const analytics = useAnalytics();


  /* =======================================================
     LIVE SUPABASE ISSUES
  ======================================================= */

  const [supabaseIssues, setSupabaseIssues] = useState([]);

  const [issuesLoading, setIssuesLoading] =
    useState(true);

  const [issuesError, setIssuesError] =
    useState(null);


  /* =======================================================
     LIVE SUPABASE INSPECTIONS
  ======================================================= */

  const [supabaseInspections, setSupabaseInspections] =
    useState([]);

  const [inspectionsLoading, setInspectionsLoading] =
    useState(true);

  const [inspectionsError, setInspectionsError] =
    useState(null);


  /* =======================================================
     FETCH CITIZEN ISSUES
  ======================================================= */

  const fetchIssues = async () => {

    setIssuesLoading(true);
    setIssuesError(null);

    try {

      const {
        data,
        error,
      } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) {

        console.error(
          'Admin Dashboard Supabase Issues Error:',
          error
        );

        setIssuesError(error.message);
        return;
      }

      setSupabaseIssues(data || []);

    } catch (err) {

      console.error(
        'Unexpected Dashboard Error:',
        err
      );

      setIssuesError(
        'Unable to load citizen reports.'
      );

    } finally {

      setIssuesLoading(false);
    }
  };


  useEffect(() => {
    fetchIssues();
  }, []);


  /* =======================================================
     FETCH FIELD INSPECTIONS
  ======================================================= */

  const fetchInspections = async () => {

    setInspectionsLoading(true);
    setInspectionsError(null);

    try {

      const {
        data,
        error,
      } = await supabase
        .from('inspections')
        .select('*')
        .order('inspected_at', {
          ascending: false,
        });

      if (error) {

        console.error(
          'Admin Dashboard Supabase Inspections Error:',
          error
        );

        setInspectionsError(error.message);
        setSupabaseInspections([]);

        return;
      }

      setSupabaseInspections(data || []);

    } catch (err) {

      console.error(
        'Unexpected Inspection Dashboard Error:',
        err
      );

      setInspectionsError(
        'Unable to load field inspections.'
      );

      setSupabaseInspections([]);

    } finally {

      setInspectionsLoading(false);
    }
  };


  useEffect(() => {
    fetchInspections();
  }, []);


  /* =========================================================
     LIVE ISSUE ANALYTICS
  ========================================================= */

  const totalIssues =
    supabaseIssues.length;


  const resolvedIssues =
    supabaseIssues.filter(
      (issue) =>
        RESOLVED_STATUSES.includes(
          normalizeStatus(issue.status)
        )
    ).length;


  const unresolvedIssues =
    totalIssues - resolvedIssues;


  const resolutionRate =
    totalIssues > 0
      ? Math.round(
          (resolvedIssues /
            totalIssues) *
            100
        )
      : 0;


  /* =========================================================
     ISSUE STATUS DATA
  ========================================================= */

  const issueStatusData = [
    {
      name: 'Unresolved',
      value: unresolvedIssues,
      color: '#ef4444',
    },
    {
      name: 'Resolved/Closed',
      value: resolvedIssues,
      color: '#22c55e',
    },
  ];


  /* =========================================================
     RECENT REPORTED ISSUES
  ========================================================= */

  const recentIssues =
    supabaseIssues
      .filter(
        (issue) =>
          normalizeStatus(
            issue.status
          ) === 'Reported'
      )
      .slice(0, 4);


  /* =========================================================
     EXISTING PROJECT / INFRASTRUCTURE ANALYTICS
  ========================================================= */

  const priorities =
    computeAllWardPriorities(
      state.infrastructure,
      state.issues,
      state.projects
    );


  const recentDelayed =
    state.projects
      .filter(
        (project) =>
          project.status === 'Delayed'
      )
      .slice(0, 3);


  /* =========================================================
     PROJECT CHART DATA
  ========================================================= */

  const projectStatusData =
    Object.entries(
      analytics.projects.byStatus
    ).map(
      ([name, value]) => ({
        name,
        value,
      })
    );


  /* =========================================================
     LIVE INSPECTION CHART DATA
  ========================================================= */

  const infraCondData = [
    {
      name: 'Excellent / Good',
      value:
        supabaseInspections.filter(
          (inspection) =>
            ['Excellent', 'Good'].includes(
              inspection.condition_level
            )
        ).length,
    },

    {
      name: 'Moderate',
      value:
        supabaseInspections.filter(
          (inspection) =>
            inspection.condition_level ===
            'Moderate'
        ).length,
    },

    {
      name: 'Poor / Critical',
      value:
        supabaseInspections.filter(
          (inspection) =>
            ['Poor', 'Critical'].includes(
              inspection.condition_level
            )
        ).length,
    },
  ];


  /* =========================================================
     INSPECTION SUMMARY
  ========================================================= */

  const totalInspections =
    supabaseInspections.length;


  const latestInspection =
    supabaseInspections.length > 0
      ? supabaseInspections[0]
      : null;


  /* =========================================================
     PROJECT STATUS COLORS
  ========================================================= */

  const STATUS_COLORS = {
    Planned: '#94a3b8',
    Approved: '#3b82f6',
    'In Progress': '#f59e0b',
    Delayed: '#ef4444',
    Completed: '#22c55e',
  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="flex flex-col h-full overflow-hidden">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        title="CivicFix Admin Command Dashboard"
        subtitle={`Kopargaon Municipal Council · Infrastructure Monitoring · ${new Date().toLocaleDateString(
          'en-IN',
          {
            dateStyle: 'long',
          }
        )}`}
      />


      <div className="flex-1 overflow-y-auto p-6 space-y-6">


        {/* ===================================================
            ALERTS
        =================================================== */}

        {(
          analytics.projects.delayedCount > 0 ||
          analytics.infrastructure.criticalCount > 0 ||
          unresolvedIssues > 0
        ) && (

          <div className="flex flex-wrap gap-3">


            {/* DELAYED PROJECTS */}

            {analytics.projects.delayedCount > 0 && (

              <div
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  bg-red-50 dark:bg-red-900/20
                  border border-red-200 dark:border-red-800
                  rounded-lg
                  text-sm
                  text-red-700 dark:text-red-300
                "
              >

                <AlertTriangle size={15} />

                <span>

                  <strong>
                    {analytics.projects.delayedCount}
                  </strong>{' '}

                  project(s) are delayed

                </span>

                <Link
                  to="/admin/projects"
                  className="ml-1 underline text-xs"
                >
                  Review →
                </Link>

              </div>

            )}


            {/* INFRASTRUCTURE ALERT */}

            {analytics.infrastructure.criticalCount > 0 && (

              <div
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  bg-amber-50 dark:bg-amber-900/20
                  border border-amber-200 dark:border-amber-800
                  rounded-lg
                  text-sm
                  text-amber-700 dark:text-amber-300
                "
              >

                <AlertTriangle size={15} />

                <span>

                  <strong>
                    {analytics.infrastructure.criticalCount}
                  </strong>{' '}

                  infrastructure item(s) in
                  poor/critical condition

                </span>

                <Link
                  to="/admin/infrastructure"
                  className="ml-1 underline text-xs"
                >
                  Review →
                </Link>

              </div>

            )}


            {/* UNRESOLVED ISSUES */}

            {unresolvedIssues > 0 && (

              <div
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  bg-blue-50 dark:bg-blue-900/20
                  border border-blue-200 dark:border-blue-800
                  rounded-lg
                  text-sm
                  text-blue-700 dark:text-blue-300
                "
              >

                <MessageSquare size={15} />

                <span>

                  <strong>
                    {unresolvedIssues}
                  </strong>{' '}

                  citizen issue(s) unresolved

                </span>

                <Link
                  to="/admin/issues"
                  className="ml-1 underline text-xs"
                >
                  Review →
                </Link>

              </div>

            )}

          </div>

        )}


        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


          {/* INFRASTRUCTURE */}

          <StatCard
            title="Total Infrastructure"
            value={
              analytics.infrastructure.total
            }
            subtitle={`Avg condition: ${analytics.infrastructure.avgCondition}/10 · ${analytics.infrastructure.criticalCount} critical`}
            icon={Package}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />


          {/* PROJECTS */}

          <StatCard
            title="Development Projects"
            value={
              analytics.projects.total
            }
            subtitle={`${analytics.projects.activeCount} active · ${analytics.projects.delayedCount} delayed`}
            icon={FolderOpen}
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
          />


          {/* CITIZEN COMPLAINTS */}

          <StatCard
            title="Citizen Complaints"
            value={
              issuesLoading
                ? '...'
                : totalIssues
            }
            subtitle={
              issuesLoading
                ? 'Loading reports...'
                : `${unresolvedIssues} unresolved`
            }
            icon={MessageSquare}
            iconBg="bg-red-100 dark:bg-red-900/30"
            iconColor="text-red-600 dark:text-red-400"
          />


          {/* PROJECT BUDGET */}

          <StatCard
            title="Total Project Budget"
            value={
              formatCurrency(
                analytics.projects.totalBudget
              )
            }
            subtitle={`Utilised: ${formatCurrency(
              analytics.projects.totalSpent
            )}`}
            icon={IndianRupee}
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />

        </div>


        {/* ===================================================
            FIELD INSPECTION SUMMARY
        =================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* TOTAL INSPECTIONS */}

          <StatCard
            title="Field Inspections"
            value={
              inspectionsLoading
                ? '...'
                : totalInspections
            }
            subtitle={
              inspectionsLoading
                ? 'Loading inspections...'
                : 'Recorded in Supabase'
            }
            icon={Package}
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />


          {/* LATEST INSPECTION */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              p-5
            "
          >

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Latest Inspection
            </div>

            {inspectionsLoading ? (

              <div className="mt-2 text-sm text-slate-400">
                Loading...
              </div>

            ) : latestInspection ? (

              <>

                <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {latestInspection.asset_id}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {latestInspection.inspector_name || 'Unknown inspector'}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {latestInspection.condition_level || '—'}
                  {latestInspection.condition_score != null
                    ? ` · ${latestInspection.condition_score}/10`
                    : ''}
                </div>

              </>

            ) : (

              <div className="mt-2 text-sm text-slate-400">
                No inspections recorded yet.
              </div>

            )}

          </div>


          {/* INSPECTION STATUS */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              p-5
            "
          >

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Inspection Data
            </div>

            <div className="mt-2 text-sm font-bold text-green-600 dark:text-green-400">
              {inspectionsLoading
                ? 'Loading...'
                : inspectionsError
                ? 'Unavailable'
                : 'Live'}
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {inspectionsError
                ? inspectionsError
                : 'Synced with Supabase'}
            </div>

          </div>

        </div>


        {/* ===================================================
            CHARTS
        =================================================== */}

        <div className="grid md:grid-cols-3 gap-6">


          {/* PROJECT STATUS */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              p-5
            "
          >

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Projects by Status
            </h3>

            <ResponsiveContainer
              width="100%"
              height={160}
            >

              <PieChart>

                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ value }) =>
                    `${value}`
                  }
                >

                  {projectStatusData.map(
                    (entry, i) => (

                      <Cell
                        key={i}
                        fill={
                          STATUS_COLORS[
                            entry.name
                          ] || '#94a3b8'
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: '11px',
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>


          {/* COMPLAINT RESOLUTION */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              p-5
            "
          >

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Complaint Resolution
              </h3>

              <button
                onClick={fetchIssues}
                disabled={issuesLoading}
                className="
                  p-1.5
                  rounded-md
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  text-slate-500
                "
                title="Refresh complaints"
              >

                <RefreshCw
                  size={14}
                  className={
                    issuesLoading
                      ? 'animate-spin'
                      : ''
                  }
                />

              </button>

            </div>


            {issuesError ? (

              <div className="h-[160px] flex flex-col items-center justify-center text-center">

                <AlertTriangle
                  size={24}
                  className="text-red-400 mb-2"
                />

                <p className="text-xs text-red-500">
                  {issuesError}
                </p>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={160}
              >

                <PieChart>

                  <Pie
                    data={issueStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                  >

                    {issueStatusData.map(
                      (entry, i) => (

                        <Cell
                          key={i}
                          fill={entry.color}
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '11px',
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            )}


            <div className="text-center mt-1">

              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {issuesLoading
                  ? '--'
                  : `${resolutionRate}%`}
              </span>

              <span className="text-xs text-slate-500 ml-1">
                resolved
              </span>

            </div>

          </div>


          {/* INFRASTRUCTURE CONDITION */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              p-5
            "
          >

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Infrastructure Condition
              </h3>

              <button
                onClick={fetchInspections}
                disabled={inspectionsLoading}
                className="
                  p-1.5
                  rounded-md
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  text-slate-500
                "
                title="Refresh inspections"
              >

                <RefreshCw
                  size={14}
                  className={
                    inspectionsLoading
                      ? 'animate-spin'
                      : ''
                  }
                />

              </button>

            </div>


            {inspectionsError ? (

              <div className="h-[160px] flex flex-col items-center justify-center text-center">

                <AlertTriangle
                  size={24}
                  className="text-amber-400 mb-2"
                />

                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {inspectionsError}
                </p>

              </div>

            ) : inspectionsLoading ? (

              <div className="h-[160px] flex items-center justify-center text-sm text-slate-400">
                Loading inspection data...
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={160}
              >

                <BarChart
                  data={infraCondData}
                  margin={{
                    left: -20,
                    right: 5,
                    top: 5,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 9,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Inspections"
                    fill="#3b82f6"
                    radius={[
                      3,
                      3,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>


        {/* ===================================================
            WARD PRIORITIES + DELAYED PROJECTS
        =================================================== */}

        <div className="grid md:grid-cols-2 gap-6">


          {/* WARD PRIORITIES */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              overflow-hidden
            "
          >

            <div
              className="
                flex items-center justify-between
                px-5 py-4
                border-b border-slate-100
                dark:border-slate-700
              "
            >

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Ward Priority Overview
              </h3>

              <Link
                to="/admin/insights"
                className="
                  text-xs
                  text-blue-600
                  dark:text-blue-400
                  flex items-center gap-1
                  hover:underline
                "
              >

                Full insights

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="divide-y divide-slate-100 dark:divide-slate-700">

              {priorities
                .slice(0, 5)
                .map((ws) => {

                  const ts =
                    TIER_STYLES[
                      ws.tier
                    ];

                  return (

                    <div
                      key={ws.wardId}
                      className="
                        flex items-center gap-3
                        px-5 py-3
                      "
                    >

                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            ts.dot,
                        }}
                      />

                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                        {ws.wardName}
                      </span>

                      <span
                        className={`
                          text-xs
                          font-semibold
                          px-2 py-0.5
                          rounded-full
                          ${ts.bg}
                          ${ts.text}
                        `}
                      >
                        {ws.tier}
                      </span>

                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-8 text-right">
                        {ws.score}
                      </span>

                    </div>

                  );

                })}

            </div>

          </div>


          {/* DELAYED PROJECTS */}

          <div
            className="
              bg-white dark:bg-slate-800
              rounded-xl
              border border-slate-200 dark:border-slate-700
              overflow-hidden
            "
          >

            <div
              className="
                flex items-center justify-between
                px-5 py-4
                border-b border-slate-100
                dark:border-slate-700
              "
            >

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Delayed Projects
              </h3>

              <Link
                to="/admin/projects"
                className="
                  text-xs
                  text-blue-600
                  dark:text-blue-400
                  flex items-center gap-1
                  hover:underline
                "
              >

                Manage

                <ArrowRight size={12} />

              </Link>

            </div>


            {recentDelayed.length === 0 ? (

              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No delayed projects 🎉
              </div>

            ) : (

              <div className="divide-y divide-slate-100 dark:divide-slate-700">

                {recentDelayed.map((project) => (

                  <div
                    key={project.id}
                    className="px-5 py-3"
                  >

                    <div className="flex items-start justify-between gap-2 mb-1">

                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {project.name}
                      </span>

                      <StatusBadge
                        status={
                          project.status
                        }
                      />

                    </div>

                    <div className="text-xs text-slate-500">

                      {getWardName(
                        project.wardId
                      )}

                      {' · '}

                      {formatCurrency(
                        project.budget
                      )}

                      {' · '}

                      {project.progress}% done

                    </div>

                    <ProgressBar
                      value={
                        project.progress
                      }
                      color="red"
                      size="xs"
                      className="mt-1.5"
                    />

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* ===================================================
            NEW REPORTED ISSUES
        =================================================== */}

        <div
          className="
            bg-white dark:bg-slate-800
            rounded-xl
            border border-slate-200 dark:border-slate-700
            overflow-hidden
          "
        >

          <div
            className="
              flex items-center justify-between
              px-5 py-4
              border-b border-slate-100
              dark:border-slate-700
            "
          >

            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              New Reported Issues
            </h3>

            <Link
              to="/admin/issues"
              className="
                text-xs
                text-blue-600
                dark:text-blue-400
                flex items-center gap-1
                hover:underline
              "
            >

              Manage all

              <ArrowRight size={12} />

            </Link>

          </div>


          {/* LOADING */}

          {issuesLoading && (

            <div className="px-5 py-8 flex items-center justify-center text-sm text-slate-400">

              <RefreshCw
                size={16}
                className="animate-spin mr-2"
              />

              Loading citizen reports...

            </div>

          )}


          {/* ERROR */}

          {!issuesLoading &&
            issuesError && (

              <div className="px-5 py-8 text-center">

                <p className="text-sm text-red-500 mb-2">
                  {issuesError}
                </p>

                <button
                  onClick={fetchIssues}
                  className="
                    text-xs
                    text-blue-600
                    hover:underline
                  "
                >
                  Try again
                </button>

              </div>

            )}


          {/* EMPTY */}

          {!issuesLoading &&
            !issuesError &&
            recentIssues.length === 0 && (

              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No new reported issues 🎉
              </div>

            )}


          {/* ISSUE LIST */}

          {!issuesLoading &&
            !issuesError &&
            recentIssues.length > 0 && (

              <div className="divide-y divide-slate-100 dark:divide-slate-700">

                {recentIssues.map((issue) => {

                  const status =
                    normalizeStatus(
                      issue.status
                    );

                  const createdDate =
                    issue.created_at
                      ? new Date(
                          issue.created_at
                        )
                      : null;

                  return (

                    <div
                      key={issue.id}
                      className="
                        flex items-start
                        gap-3
                        px-5 py-3
                      "
                    >

                      <MapPin
                        size={14}
                        className="
                          text-red-400
                          mt-0.5
                          flex-shrink-0
                        "
                      />

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-xs font-mono text-slate-400">
                            {issue.id}
                          </span>

                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {issue.category}
                          </span>

                          {issue.location && (

                            <span className="text-xs text-slate-400">
                              {issue.location}
                            </span>

                          )}

                        </div>


                        <div className="text-xs text-slate-500 truncate">

                          {issue.description
                            ? issue.description.slice(
                                0,
                                70
                              )
                            : 'No description'}

                          {issue.description &&
                          issue.description.length >
                            70
                            ? '…'
                            : ''}

                        </div>


                        {createdDate && (

                          <div className="text-[10px] text-slate-400 mt-0.5">

                            Submitted:{' '}

                            {formatDate(
                              createdDate
                            )}

                          </div>

                        )}

                      </div>


                      <StatusBadge
                        status={status}
                      />

                    </div>

                  );

                })}

              </div>

            )}

        </div>


      </div>

    </div>

  );
}