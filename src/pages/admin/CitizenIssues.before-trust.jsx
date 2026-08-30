import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

import Header from '../../components/ui/Header.jsx';
import { supabase } from '../../lib/supabase.js';

import {
  computeIssuePriority,
} from '../../utils/issuePriority.js';


// ======================================================
// STATUS
// ======================================================

const STATUS_ORDER = [
  'pending',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'verified',
];

const STATUS_LABELS = {
  pending: 'Reported',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  verified: 'Verified',
};

const STATUS_STYLES = {
  pending:
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',

  under_review:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',

  assigned:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',

  in_progress:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',

  resolved:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',

  verified:
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};


// ======================================================
// PRIORITY
// ======================================================

const PRIORITY_STYLES = {
  CRITICAL:
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',

  HIGH:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',

  MEDIUM:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',

  LOW:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};


// ======================================================
// NORMALIZE STATUS
// ======================================================

function normalizeStatus(status) {
  const value = String(
    status || 'pending'
  )
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  if (
    STATUS_ORDER.includes(value)
  ) {
    return value;
  }

  if (value === 'reported') {
    return 'pending';
  }

  if (
    value === 'review' ||
    value === 'reviewed'
  ) {
    return 'under_review';
  }

  if (value === 'working') {
    return 'in_progress';
  }

  if (value === 'completed') {
    return 'resolved';
  }

  return 'pending';
}


// ======================================================
// NORMALIZE PRIORITY
// ======================================================

function normalizePriority(priority) {
  const value = String(
    priority || ''
  )
    .trim()
    .toUpperCase();

  if (
    [
      'CRITICAL',
      'HIGH',
      'MEDIUM',
      'LOW',
    ].includes(value)
  ) {
    return value;
  }

  return null;
}


// ======================================================
// AI PRIORITY
// ======================================================
//
// IMPORTANT:
// This DOES NOT use priority_score.
// This DOES NOT require an AI score column.
//
// It uses the existing local priority engine:
//
// src/utils/issuePriority.js
//
// computeIssuePriority(issue)
//
// The engine uses:
// Severity       25%
// Safety Risk    25%
// Location       15%
// Urgency        10%
// Waiting Time    5%
// Context        20%
//
// ======================================================

function getIssuePriority(issue) {
  if (!issue) {
    return null;
  }

  try {
    const result =
      computeIssuePriority(issue);

    if (
      result &&
      typeof result.score === 'number'
    ) {
      return {
        score: Math.round(
          result.score
        ),

        tier:
          result.tier ||
          'MEDIUM',

        factors:
          result.factors || {},

        reasons:
          result.reasons || [],
      };
    }
  } catch (error) {
    console.error(
      'AI priority calculation failed:',
      error
    );
  }

  // --------------------------------------------------
  // FALLBACK
  // --------------------------------------------------

  const dbPriority =
    normalizePriority(
      issue.ai_priority
    ) ||
    normalizePriority(
      issue.priority
    ) ||
    'MEDIUM';

  const fallbackScore = {
    CRITICAL: 90,
    HIGH: 75,
    MEDIUM: 50,
    LOW: 30,
  };

  return {
    score:
      fallbackScore[
        dbPriority
      ] || 50,

    tier: dbPriority,

    factors: {},

    reasons: [
      'Priority calculated from available issue data.',
    ],
  };
}


// ======================================================
// MAP SUPABASE ISSUE
// ======================================================

function mapSupabaseIssue(issue) {
  const status =
    normalizeStatus(
      issue.status
    );

  const aiPriority =
    getIssuePriority(issue);

  return {
    ...issue,

    id:
      issue.id,

    title:
      issue.title ||
      issue.description?.slice(
        0,
        60
      ) ||
      'Civic Issue',

    description:
      issue.description || '',

    category:
      issue.category ||
      'Other',

    priority:
      normalizePriority(
        issue.priority
      ) ||
      'MEDIUM',

    aiPriority,

    aiScore:
      aiPriority?.score || 0,

    aiPriorityReason:
      issue.ai_priority_reason ||
      aiPriority?.reasons?.[0] ||
      'Priority calculated from available issue data.',

    status,

    displayStatus:
      STATUS_LABELS[
        status
      ] || 'Reported',

    citizenName:
      issue.citizen_name ||
      'Citizen',

    isAnonymous:
      !issue.citizen_name ||
      String(
        issue.citizen_name
      )
        .toLowerCase()
        .includes('anonymous'),

    location:
      issue.location ||
      'Kopargaon',

    lat:
      issue.latitude,

    lng:
      issue.longitude,

    photo_url:
      issue.photo_url ||
      null,

    createdAt:
      issue.created_at
        ? new Date(
            issue.created_at
          )
        : null,

    updatedAt:
      issue.updated_at
        ? new Date(
            issue.updated_at
          )
        : null,

    submittedDate:
      issue.created_at
        ? new Date(
            issue.created_at
          )
        : null,
  };
}


// ======================================================
// DATE
// ======================================================

function formatDate(date) {
  if (!date) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    ).format(
      date instanceof Date
        ? date
        : new Date(date)
    );
  } catch {
    return '—';
  }
}


// ======================================================
// RELATIVE TIME
// ======================================================

function getRelativeTime(date) {
  if (!date) {
    return '—';
  }

  try {
    const value =
      date instanceof Date
        ? date
        : new Date(date);

    const diff =
      Date.now() -
      value.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 30) {
      return `${days}d ago`;
    }

    return formatDate(value);
  } catch {
    return '—';
  }
}


// ======================================================
// MAIN
// ======================================================

export default function CitizenIssues() {
  const [
    issues,
    setIssues,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('all');

  const [
    filterPriority,
    setFilterPriority,
  ] = useState('all');

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  // ==================================================
  // FETCH ISSUES
  // ==================================================

  const fetchIssues = async (
    showRefresh = false
  ) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      /*
       * IMPORTANT:
       *
       * We use select('*').
       *
       * Therefore there is NO reference to:
       * priority_score
       *
       * The AI engine calculates the score locally.
       */

      const {
        data,
        error,
      } = await supabase
        .from('issues')
        .select('*')
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

      if (error) {
        console.error(
          'Failed to fetch citizen issues:',
          error
        );

        alert(
          `Failed to load citizen issues:\n\n${error.message}`
        );

        return;
      }

      const mapped =
        (data || []).map(
          mapSupabaseIssue
        );

      setIssues(mapped);

      /*
       * If the currently selected issue
       * exists, update it too.
       */

      setSelected(
        current => {
          if (!current) {
            return null;
          }

          return (
            mapped.find(
              issue =>
                issue.id ===
                current.id
            ) || null
          );
        }
      );

    } catch (error) {
      console.error(
        'Unexpected issue fetch error:',
        error
      );

      alert(
        error?.message ||
        'Could not load citizen issues.'
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchIssues();
  }, []);


  // ==================================================
  // FILTERED ISSUES
  // ==================================================

  const filteredIssues =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return issues.filter(
        issue => {
          const matchesSearch =
            !query ||
            String(
              issue.id || ''
            )
              .toLowerCase()
              .includes(query) ||
            String(
              issue.title || ''
            )
              .toLowerCase()
              .includes(query) ||
            String(
              issue.description || ''
            )
              .toLowerCase()
              .includes(query) ||
            String(
              issue.category || ''
            )
              .toLowerCase()
              .includes(query) ||
            String(
              issue.location || ''
            )
              .toLowerCase()
              .includes(query) ||
            String(
              issue.citizenName || ''
            )
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            filterStatus === 'all' ||
            issue.status ===
              filterStatus;

          const matchesPriority =
            filterPriority ===
              'all' ||
            issue.aiPriority?.tier ===
              filterPriority;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      issues,
      search,
      filterStatus,
      filterPriority,
    ]);


  // ==================================================
  // STATS
  // ==================================================

  const stats = useMemo(() => {
    const total =
      issues.length;

    const unresolved =
      issues.filter(
        issue =>
          ![
            'resolved',
            'verified',
          ].includes(
            issue.status
          )
      ).length;

    const critical =
      issues.filter(
        issue =>
          issue.aiPriority
            ?.tier ===
          'CRITICAL'
      ).length;

    const high =
      issues.filter(
        issue =>
          issue.aiPriority
            ?.tier ===
          'HIGH'
      ).length;

    const medium =
      issues.filter(
        issue =>
          issue.aiPriority
            ?.tier ===
          'MEDIUM'
      ).length;

    const low =
      issues.filter(
        issue =>
          issue.aiPriority
            ?.tier ===
          'LOW'
      ).length;

    return {
      total,
      unresolved,
      critical,
      high,
      medium,
      low,
    };
  }, [issues]);


  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const updateStatus = async (
    issue,
    newStatus
  ) => {
    if (!issue?.id) {
      return;
    }

    setUpdatingId(
      issue.id
    );

    try {
      const {
        error,
      } = await supabase
        .from('issues')
        .update({
          status:
            newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          issue.id
        );

      if (error) {
        console.error(
          'Status update error:',
          error
        );

        alert(
          `Failed to update status:\n\n${error.message}`
        );

        return;
      }

      /*
       * Update local state immediately.
       */

      setIssues(
        current =>
          current.map(
            item => {
              if (
                item.id !==
                issue.id
              ) {
                return item;
              }

              const normalized =
                normalizeStatus(
                  newStatus
                );

              return {
                ...item,

                status:
                  normalized,

                displayStatus:
                  STATUS_LABELS[
                    normalized
                  ] || 'Reported',

                updatedAt:
                  new Date(),
              };
            }
          )
      );

      setSelected(
        current => {
          if (
            !current ||
            current.id !==
              issue.id
          ) {
            return current;
          }

          const normalized =
            normalizeStatus(
              newStatus
            );

          return {
            ...current,

            status:
              normalized,

            displayStatus:
              STATUS_LABELS[
                normalized
              ] || 'Reported',

            updatedAt:
              new Date(),
          };
        }
      );

    } catch (error) {
      console.error(
        'Status update failed:',
        error
      );

      alert(
        `Failed to update status:\n\n${
          error?.message ||
          'Unknown error'
        }`
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ==================================================
  // NEXT STATUS
  // ==================================================

  const getNextStatus = (
    status
  ) => {
    const index =
      STATUS_ORDER.indexOf(
        status
      );

    if (
      index < 0 ||
      index >=
        STATUS_ORDER.length - 1
    ) {
      return null;
    }

    return STATUS_ORDER[
      index + 1
    ];
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">

        <Header
          title="Citizen Issues"
          subtitle="Kopargaon Citizen Issues Triage"
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">

            <RefreshCw
              size={20}
              className="animate-spin"
            />

            Loading citizen issues...

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">

      <Header
        title="Citizen Issues"
        subtitle="Kopargaon Citizen Issues Triage"
      />


      <div className="flex-1 overflow-y-auto p-6">

        <div className="max-w-7xl mx-auto space-y-6">


          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">

                Kopargaon Citizen Issues Triage

              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                Review citizen complaints,
                AI priority assessments,
                and municipal workflow status.

              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                fetchIssues(true)
              }
              disabled={
                refreshing
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition disabled:opacity-60"
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh

            </button>

          </div>


          {/* ==========================================
              STATS
          ========================================== */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              label="Total Issues"
              value={
                stats.total
              }
              icon={
                <AlertTriangle
                  size={20}
                />
              }
            />

            <StatCard
              label="Unresolved"
              value={
                stats.unresolved
              }
              icon={
                <Clock
                  size={20}
                />
              }
            />

            <StatCard
              label="Critical"
              value={
                stats.critical
              }
              icon={
                <AlertTriangle
                  size={20}
                />
              }
            />

            <StatCard
              label="High Priority"
              value={
                stats.high
              }
              icon={
                <Brain
                  size={20}
                />
              }
            />

          </div>


          {/* ==========================================
              AI SUMMARY
          ========================================== */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <PrioritySummary
              label="Critical"
              value={
                stats.critical
              }
              priority="CRITICAL"
            />

            <PrioritySummary
              label="High"
              value={
                stats.high
              }
              priority="HIGH"
            />

            <PrioritySummary
              label="Medium"
              value={
                stats.medium
              }
              priority="MEDIUM"
            />

            <PrioritySummary
              label="Low"
              value={
                stats.low
              }
              priority="LOW"
            />

          </div>


          {/* ==========================================
              FILTER BAR
          ========================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={
                    search
                  }
                  onChange={e =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search issue, category, ward, citizen..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20"
                />

              </div>


              {/* STATUS */}

              <select
                value={
                  filterStatus
                }
                onChange={e =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
              >

                <option value="all">
                  All Status
                </option>

                {STATUS_ORDER.map(
                  status => (
                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {
                        STATUS_LABELS[
                          status
                        ]
                      }
                    </option>
                  )
                )}

              </select>


              {/* PRIORITY */}

              <select
                value={
                  filterPriority
                }
                onChange={e =>
                  setFilterPriority(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
              >

                <option value="all">
                  All Priority
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="LOW">
                  Low
                </option>

              </select>

            </div>

          </div>


          {/* ==========================================
              TABLE
          ========================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">

                  Citizen Issues

                </h2>

                <p className="text-xs text-slate-500 mt-1">

                  {filteredIssues.length}{' '}
                  issue
                  {filteredIssues.length !== 1
                    ? 's'
                    : ''}{' '}
                  shown

                </p>

              </div>


              <div className="flex items-center gap-2 text-xs text-slate-400">

                <Brain
                  size={15}
                  className="text-indigo-500"
                />

                Live AI Priority

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-slate-50 dark:bg-slate-950/50">

                  <tr>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      ID
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Category
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Location
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Description
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Reported By
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Timeline
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      AI Priority
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                      Workflow Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                  {filteredIssues.map(
                    issue => {

                      const nextStatus =
                        getNextStatus(
                          issue.status
                        );

                      const priority =
                        issue.aiPriority;

                      return (

                        <tr
                          key={
                            issue.id
                          }
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >

                          {/* ID */}

                          <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">

                            {issue.id}

                          </td>


                          {/* CATEGORY */}

                          <td className="px-4 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">

                            {issue.category}

                          </td>


                          {/* LOCATION */}

                          <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">

                            <div className="flex items-center gap-1.5">

                              <MapPin
                                size={13}
                                className="text-slate-400"
                              />

                              {issue.location ||
                                'Unknown'}

                            </div>

                          </td>


                          {/* DESCRIPTION */}

                          <td className="px-4 py-3.5 max-w-[260px]">

                            <span className="line-clamp-2 text-sm text-slate-700 dark:text-slate-300 leading-snug">

                              {issue.description ||
                                'No description'}

                            </span>

                          </td>


                          {/* CITIZEN */}

                          <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">

                            {issue.isAnonymous
                              ? 'Anonymous'
                              : issue.citizenName}

                          </td>


                          {/* TIMELINE */}

                          <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">

                            {getRelativeTime(
                              issue.submittedDate
                            )}

                          </td>


                          {/* AI PRIORITY */}

                          <td className="px-4 py-3.5 whitespace-nowrap">

                            {priority && (

                              <button
                                type="button"
                                onClick={() =>
                                  setSelected(
                                    issue
                                  )
                                }
                                className="flex items-center gap-2 group"
                                title="View AI priority assessment"
                              >

                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    PRIORITY_STYLES[
                                      priority.tier
                                    ] ||
                                    PRIORITY_STYLES.MEDIUM
                                  }`}
                                >

                                  {
                                    priority.tier
                                  }

                                </span>


                                <span className="text-[11px] font-bold text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">

                                  {
                                    priority.score
                                  }
                                  /100

                                </span>

                              </button>

                            )}

                          </td>


                          {/* STATUS */}

                          <td className="px-4 py-3.5 whitespace-nowrap">

                            <StatusBadge
                              status={
                                issue.status
                              }
                            />

                          </td>


                          {/* ACTION */}

                          <td className="px-4 py-3.5 whitespace-nowrap">

                            <div className="flex items-center gap-3">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelected(
                                    issue
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >

                                <Eye
                                  size={14}
                                />

                                View

                              </button>


                              {nextStatus && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      issue,
                                      nextStatus
                                    )
                                  }
                                  disabled={
                                    updatingId ===
                                    issue.id
                                  }
                                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50"
                                >

                                  {updatingId ===
                                  issue.id
                                    ? 'Updating...'
                                    : `→ ${
                                        STATUS_LABELS[
                                          nextStatus
                                        ]
                                      }`}

                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>


            {!filteredIssues.length && (

              <div className="py-16 text-center">

                <AlertTriangle
                  size={30}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="font-semibold text-slate-700 dark:text-slate-300">

                  No citizen issues found

                </p>

                <p className="text-sm text-slate-400 mt-1">

                  Try changing your filters.

                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ================================================
          DETAIL MODAL
      ================================================ */}

      {selected && (

        <IssueModal
          issue={
            selected
          }
          onClose={() =>
            setSelected(
              null
            )
          }
          onUpdateStatus={
            updateStatus
          }
          updating={
            updatingId ===
            selected.id
          }
        />

      )}

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

            {label}

          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">

            {value}

          </p>

        </div>


        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">

          {icon}

        </div>

      </div>

    </div>
  );
}


// ======================================================
// PRIORITY SUMMARY
// ======================================================

function PrioritySummary({
  label,
  value,
  priority,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">

      <div className="flex items-center justify-between">

        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            PRIORITY_STYLES[
              priority
            ]
          }`}
        >
          {label}
        </span>

        <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {value}
        </span>

      </div>

    </div>
  );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
        STATUS_STYLES[
          status
        ] ||
        STATUS_STYLES.pending
      }`}
    >

      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      {
        STATUS_LABELS[
          status
        ] || 'Reported'
      }

    </span>
  );
}


// ======================================================
// ISSUE MODAL
// ======================================================

function IssueModal({
  issue,
  onClose,
  onUpdateStatus,
  updating,
}) {
  const priority =
    issue.aiPriority;

  const nextStatus =
    getNextStatusStatic(
      issue.status
    );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <span className="font-mono text-xs text-slate-400">
                {issue.id}
              </span>

              {priority && (

                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    PRIORITY_STYLES[
                      priority.tier
                    ]
                  }`}
                >
                  {priority.tier}
                </span>

              )}

            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">

              {issue.title}

            </h2>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
          >

            <X
              size={18}
            />

          </button>

        </div>


        <div className="p-5 space-y-5">


          {/* ==========================================
              PHOTO
          ========================================== */}

          {issue.photo_url ? (

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">

                <ImageIcon
                  size={14}
                />

                Citizen Uploaded Evidence

              </div>

              <img
                src={
                  issue.photo_url
                }
                alt="Citizen uploaded evidence"
                className="w-full max-h-[360px] object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />

            </div>

          ) : (

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">

              <ImageIcon
                size={22}
                className="text-slate-300"
              />

              <div>

                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No photo uploaded
                </p>

                <p className="text-xs text-slate-400">
                  This citizen report has no attached image.
                </p>

              </div>

            </div>

          )}


          {/* ==========================================
              BASIC INFO
          ========================================== */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <InfoBox
              icon={
                <AlertTriangle
                  size={14}
                />
              }
              label="Category"
              value={
                issue.category
              }
            />

            <InfoBox
              icon={
                <MapPin
                  size={14}
                />
              }
              label="Location"
              value={
                issue.location ||
                'Kopargaon'
              }
            />

            <InfoBox
              icon={
                <Calendar
                  size={14}
                />
              }
              label="Reported"
              value={
                formatDate(
                  issue.createdAt
                )
              }
            />

            <InfoBox
              icon={
                <Clock
                  size={14}
                />
              }
              label="Status"
              value={
                issue.displayStatus
              }
            />

          </div>


          {/* ==========================================
              CITIZEN
          ========================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <DetailItem
              label="Reported By"
              value={
                issue.isAnonymous
                  ? 'Anonymous'
                  : issue.citizenName
              }
            />

            <DetailItem
              label="Issue ID"
              value={
                issue.id
              }
            />

          </div>


          {/* ==========================================
              LOCATION
          ========================================== */}

          {issue.latitude != null &&
            issue.longitude != null && (

              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">

                <MapPin
                  size={18}
                  className="text-blue-500"
                />

                <div>

                  <div className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">
                    GPS Coordinates
                  </div>

                  <div className="font-mono text-sm text-blue-700 dark:text-blue-300">

                    {Number(
                      issue.latitude
                    ).toFixed(
                      6
                    )}

                    ,{' '}

                    {Number(
                      issue.longitude
                    ).toFixed(
                      6
                    )}

                  </div>

                </div>

              </div>

            )}


          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">

            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">

              Issue Description

            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">

              {
                issue.description ||
                'No description provided.'
              }

            </p>

          </div>


          {/* ==========================================
              AI PRIORITY ASSESSMENT
          ========================================== */}

          {priority && (

            <div className="p-5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                <div>

                  <div className="flex items-center gap-2">

                    <Brain
                      size={18}
                      className="text-indigo-600 dark:text-indigo-400"
                    />

                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">

                      AI Priority Assessment

                    </span>

                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">

                    Calculated from live complaint data

                  </p>

                </div>


                <div className="text-right">

                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">

                    {
                      priority.score
                    }

                    <span className="text-sm font-semibold text-slate-400">
                      /100
                    </span>

                  </div>

                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      PRIORITY_STYLES[
                        priority.tier
                      ]
                    }`}
                  >
                    {priority.tier}
                  </span>

                </div>

              </div>


              {/* SCORE BAR */}

              <div className="mb-5">

                <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full ${
                      priority.tier ===
                      'CRITICAL'
                        ? 'bg-red-500'
                        : priority.tier ===
                          'HIGH'
                        ? 'bg-orange-500'
                        : priority.tier ===
                          'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          priority.score
                        )
                      )}%`,
                    }}
                  />

                </div>

              </div>


              {/* FACTORS */}

              {priority.factors &&
                Object.keys(
                  priority.factors
                ).length > 0 && (

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">

                    <Factor
                      label="Severity"
                      value={
                        priority
                          .factors
                          .severity
                      }
                    />

                    <Factor
                      label="Safety Risk"
                      value={
                        priority
                          .factors
                          .safetyRisk
                      }
                    />

                    <Factor
                      label="Location"
                      value={
                        priority
                          .factors
                          .locationCriticality
                      }
                    />

                    <Factor
                      label="Urgency"
                      value={
                        priority
                          .factors
                          .urgency
                      }
                    />

                    <Factor
                      label="Waiting Time"
                      value={
                        priority
                          .factors
                          .waitingTime
                      }
                    />

                    <Factor
                      label="Context / Impact"
                      value={
                        priority
                          .factors
                          .contextImpact
                      }
                    />

                  </div>

                )}


              {/* REASONS */}

              {priority.reasons?.length >
                0 && (

                <div>

                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 mb-2">

                    Why this priority?

                  </div>

                  <div className="space-y-2">

                    {priority.reasons.map(
                      (
                        reason,
                        index
                      ) => (

                        <div
                          key={
                            `${reason}-${index}`
                          }
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >

                          <CheckCircle
                            size={14}
                            className="text-indigo-500 mt-0.5 flex-shrink-0"
                          />

                          <span>
                            {reason}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          )}


{/* ==========================================
    AI TRUST / VERIFICATION SCORE
========================================== */}

<div className="mt-5 p-5 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

    <div>

      <div className="flex items-center gap-2">

        <Brain
          size={18}
          className="text-teal-600 dark:text-teal-400"
        />

        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">
          AI Trust / Verification Score
        </span>

      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Evidence-based complaint verification
      </p>

    </div>

    <div className="text-right">

      <div className="text-3xl font-black text-teal-600 dark:text-teal-400">

        {selected?.trustScore ?? issue.trustScore ?? 0}

        <span className="text-sm font-semibold text-slate-400">
          /100
        </span>

      </div>

      <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">

        {selected?.trustLabel ??
          issue.trustLabel ??
          'NEEDS VERIFICATION'}

      </span>

    </div>

  </div>


  {/* TRUST SCORE BAR */}

  <div className="mb-5">

    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">

      <span>Verification Confidence</span>

      <span>
        {selected?.trustScore ?? issue.trustScore ?? 0}%
      </span>

    </div>

    <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">

      <div
        className="h-full rounded-full bg-teal-500 transition-all"
        style={{
          width: `${Math.min(
            100,
            Math.max(
              0,
              selected?.trustScore ??
                issue.trustScore ??
                0
            )
          )}%`,
        }}
      />

    </div>

  </div>


  {/* EVIDENCE FACTORS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

    {(
      selected?.trustFactors ??
      issue.trustFactors ??
      []
    ).map((factor, index) => (

      <div
        key={`${factor.label}-${index}`}
        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
      >

        <span className="text-xs text-slate-600 dark:text-slate-300">
          {factor.label}
        </span>

        <span
          className={`text-xs font-bold ${
            factor.positive
              ? 'text-green-600 dark:text-green-400'
              : 'text-slate-400'
          }`}
        >
          {factor.value}
        </span>

      </div>

    ))}

  </div>


  <div className="mt-4 p-3 rounded-lg bg-white/70 dark:bg-slate-900/50">

    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">

      <strong className="text-slate-700 dark:text-slate-300">
        Advisory only:
      </strong>{' '}
      This score evaluates available evidence such as
      photo, location, description quality and reporter
      information. Final verification remains with municipal
      officials.

    </p>

  </div>

</div>

          {/* ==========================================
              WORKFLOW
          ========================================== */}

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">

            <div className="flex items-center justify-between gap-4">

              <div>

                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">

                  Municipal Workflow

                </div>

                <div className="mt-1">

                  <StatusBadge
                    status={
                      issue.status
                    }
                  />

                </div>

              </div>


              {nextStatus && (

                <button
                  type="button"
                  onClick={() =>
                    onUpdateStatus(
                      issue,
                      nextStatus
                    )
                  }
                  disabled={
                    updating
                  }
                  className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50"
                >

                  {updating
                    ? 'Updating...'
                    : `Move to ${
                        STATUS_LABELS[
                          nextStatus
                        ]
                      }`}

                </button>

              )}

            </div>


            {/* STATUS FLOW */}

            <div className="flex flex-wrap gap-2 mt-4">

              {STATUS_ORDER.map(
                status => (

                  <div
                    key={
                      status
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold ${
                      issue.status ===
                      status
                        ? STATUS_STYLES[
                            status
                          ]
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {
                      STATUS_LABELS[
                        status
                      ]
                    }
                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// STATIC NEXT STATUS
// ======================================================

function getNextStatusStatic(
  status
) {
  const index =
    STATUS_ORDER.indexOf(
      status
    );

  if (
    index < 0 ||
    index >=
      STATUS_ORDER.length - 1
  ) {
    return null;
  }

  return STATUS_ORDER[
    index + 1
  ];
}


// ======================================================
// INFO BOX
// ======================================================

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

      <div className="flex items-center gap-2 text-slate-400 mb-1">

        {icon}

        <span className="text-[10px] uppercase tracking-wider font-bold">

          {label}

        </span>

      </div>

      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 break-words">

        {value}

      </p>

    </div>
  );
}


// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">

        {label}

      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 break-words">

        {value}

      </p>

    </div>
  );
}


// ======================================================
// FACTOR
// ======================================================

function Factor({
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-lg bg-white/70 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900">

      <div className="text-[10px] text-slate-400 uppercase font-semibold">

        {label}

      </div>

      <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">

        {value ?? '—'}

        <span className="text-[10px] text-slate-400 font-normal">
          /100
        </span>

      </div>

    </div>
  );
}