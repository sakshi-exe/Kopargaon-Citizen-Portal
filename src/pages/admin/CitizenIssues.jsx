import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Search,
  X,
  User,
  Calendar,
  ExternalLink,
  Brain,
} from 'lucide-react';

import Header from '../../components/ui/Header.jsx';
import { supabase } from '../../lib/supabase.js';


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
  const value = String(status || 'pending')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  if (STATUS_ORDER.includes(value)) {
    return value;
  }

  if (value === 'reported') return 'pending';
  if (value === 'review') return 'under_review';
  if (value === 'reviewed') return 'under_review';
  if (value === 'working') return 'in_progress';
  if (value === 'completed') return 'resolved';

  return 'pending';
}


// ======================================================
// NORMALIZE PRIORITY
// ======================================================

function normalizePriority(priority) {
  const value = String(priority || 'medium')
    .toUpperCase()
    .trim();

  if (
    value === 'CRITICAL' ||
    value === 'HIGH' ||
    value === 'MEDIUM' ||
    value === 'LOW'
  ) {
    return value;
  }

  return 'MEDIUM';
}


// ======================================================
// TRUST SCORE
//
// IMPORTANT:
// This function was missing in your current file.
// That was causing:
// "Can't find variable: calculateTrustScore"
// ======================================================

function calculateTrustScore(issue) {
  let score = 50;

  if (issue) {
    if (issue.citizen_name) {
      score += 10;
    }

    if (
      issue.latitude !== null &&
      issue.latitude !== undefined &&
      issue.longitude !== null &&
      issue.longitude !== undefined
    ) {
      score += 15;
    }

    if (issue.photo_url) {
      score += 15;
    }

    if (issue.description) {
      const description =
        String(issue.description).trim();

      if (description.length >= 30) {
        score += 10;
      }
    }
  }

  return Math.min(100, Math.max(0, score));
}


// ======================================================
// AI PRIORITY SCORE
// ======================================================

function calculatePriorityScore(issue) {
  /*
   * First use a real database score if available.
   */

  if (
    typeof issue?.ai_score === 'number' &&
    Number.isFinite(issue.ai_score)
  ) {
    return Math.round(issue.ai_score);
  }

  if (
    typeof issue?.priority_score === 'number' &&
    Number.isFinite(issue.priority_score)
  ) {
    return Math.round(issue.priority_score);
  }

  /*
   * Otherwise calculate a transparent score
   * from the available issue information.
   */

  let score = 50;

  const priority =
    normalizePriority(issue?.priority);

  if (priority === 'CRITICAL') {
    score = 90;
  } else if (priority === 'HIGH') {
    score = 75;
  } else if (priority === 'MEDIUM') {
    score = 50;
  } else if (priority === 'LOW') {
    score = 30;
  }

  /*
   * Category-based adjustments.
   */

  const category =
    String(issue?.category || '').toLowerCase();

  if (
    category.includes('water') ||
    category.includes('sewage') ||
    category.includes('electric') ||
    category.includes('electricity') ||
    category.includes('road')
  ) {
    score += 5;
  }

  if (
    category.includes('garbage') ||
    category.includes('waste') ||
    category.includes('sanitation')
  ) {
    score += 4;
  }

  /*
   * Description signal.
   */

  const description =
    String(issue?.description || '').toLowerCase();

  const urgentWords = [
    'danger',
    'dangerous',
    'accident',
    'injury',
    'injured',
    'emergency',
    'fire',
    'flood',
    'open manhole',
    'leak',
    'collapse',
  ];

  const hasUrgentWord =
    urgentWords.some((word) =>
      description.includes(word)
    );

  if (hasUrgentWord) {
    score += 10;
  }

  /*
   * Location data makes the report more actionable.
   */

  if (
    issue?.latitude !== null &&
    issue?.latitude !== undefined &&
    issue?.longitude !== null &&
    issue?.longitude !== undefined
  ) {
    score += 3;
  }

  /*
   * Photo evidence.
   */

  if (issue?.photo_url) {
    score += 3;
  }

  score = Math.min(100, Math.max(0, score));

  let tier = 'LOW';

  if (score >= 85) {
    tier = 'CRITICAL';
  } else if (score >= 70) {
    tier = 'HIGH';
  } else if (score >= 45) {
    tier = 'MEDIUM';
  }

  const reasons = [];

  if (hasUrgentWord) {
    reasons.push(
      'Description contains urgent or safety-related information.'
    );
  }

  if (issue?.photo_url) {
    reasons.push(
      'Photo evidence is available.'
    );
  }

  if (
    issue?.latitude !== null &&
    issue?.latitude !== undefined &&
    issue?.longitude !== null &&
    issue?.longitude !== undefined
  ) {
    reasons.push(
      'Location coordinates are available for field verification.'
    );
  }

  if (!reasons.length) {
    reasons.push(
      'Priority calculated from available issue data.'
    );
  }

  return {
    score,
    tier,
    factors: {
      basePriority: priority,
      trustScore: calculateTrustScore(issue),
      urgentSignal: hasUrgentWord,
      photoEvidence: Boolean(issue?.photo_url),
      locationEvidence:
        issue?.latitude !== null &&
        issue?.latitude !== undefined &&
        issue?.longitude !== null &&
        issue?.longitude !== undefined,
    },
    reasons,
  };
}


// ======================================================
// GET ISSUE PRIORITY
// ======================================================

function getIssuePriority(issue) {
  return calculatePriorityScore(issue);
}


// ======================================================
// MAP SUPABASE ISSUE
// ======================================================

function mapSupabaseIssue(issue) {
  const status =
    normalizeStatus(issue?.status);

  const aiPriority =
    getIssuePriority(issue);

  const priority =
    normalizePriority(issue?.priority);

  return {
    ...issue,

    id: issue?.id,

    title:
      issue?.title ||
      issue?.description?.slice(0, 60) ||
      'Civic Issue',

    description:
      issue?.description || '',

    category:
      issue?.category || 'Other',

    priority,

    aiPriority,

    aiScore:
      aiPriority?.score || 0,

    aiPriorityReason:
      issue?.ai_priority_reason ||
      aiPriority?.reasons?.[0] ||
      'Priority calculated from available issue data.',

    trustScore:
      calculateTrustScore(issue),

    status,

    displayStatus:
      STATUS_LABELS[status] || 'Reported',

    citizenName:
      issue?.citizen_name || 'Citizen',

    isAnonymous:
      !issue?.citizen_name ||
      String(issue.citizen_name)
        .toLowerCase()
        .includes('anonymous'),

    location:
      issue?.location || 'Kopargaon',

    lat:
      issue?.latitude,

    lng:
      issue?.longitude,

    photo_url:
      issue?.photo_url || null,

    createdAt:
      issue?.created_at
        ? new Date(issue.created_at)
        : null,

    updatedAt:
      issue?.updated_at
        ? new Date(issue.updated_at)
        : null,

    submittedDate:
      issue?.created_at
        ? new Date(issue.created_at)
        : null,
  };
}


// ======================================================
// DATE FORMAT
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

    if (diff < 0) {
      return 'Just now';
    }

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
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const normalized =
    normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
        STATUS_STYLES[normalized]
      }`}
    >
      {STATUS_LABELS[normalized]}
    </span>
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}


// ======================================================
// MAIN COMPONENT
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

      setSelected(
        (current) => {

          if (!current) {
            return null;
          }

          const updated =
            mapped.find(
              (item) =>
                item.id === current.id
            );

          return updated || null;
        }
      );

    } catch (error) {

      console.error(
        'Unexpected issue loading error:',
        error
      );

      alert(
        `Failed to load citizen issues:\n\n${
          error?.message ||
          'Unknown error'
        }`
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {
    fetchIssues();
  }, []);


  // ==================================================
  // STATS
  // ==================================================

  const stats = useMemo(() => {

    const total =
      issues.length;

    const unresolved =
      issues.filter(
        (issue) =>
          ![
            'resolved',
            'verified',
          ].includes(issue.status)
      ).length;

    const critical =
      issues.filter(
        (issue) =>
          issue.aiPriority?.tier ===
          'CRITICAL'
      ).length;

    const resolved =
      issues.filter(
        (issue) =>
          [
            'resolved',
            'verified',
          ].includes(issue.status)
      ).length;

    return {
      total,
      unresolved,
      critical,
      resolved,
    };

  }, [issues]);


  // ==================================================
  // FILTERED ISSUES
  // ==================================================

  const filteredIssues = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return issues.filter(
      (issue) => {

        const matchesSearch =
          !query ||
          String(issue.title || '')
            .toLowerCase()
            .includes(query) ||
          String(issue.description || '')
            .toLowerCase()
            .includes(query) ||
          String(issue.category || '')
            .toLowerCase()
            .includes(query) ||
          String(issue.location || '')
            .toLowerCase()
            .includes(query) ||
          String(issue.citizenName || '')
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          filterStatus === 'all' ||
          issue.status === filterStatus;

        const matchesPriority =
          filterPriority === 'all' ||
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
  // NEXT STATUS
  // ==================================================

  const getNextStatus = (
    status
  ) => {

    const index =
      STATUS_ORDER.indexOf(status);

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
  // UPDATE STATUS
  // ==================================================

  const updateStatus = async (
    issue,
    nextStatus
  ) => {

    if (
      !issue?.id ||
      !nextStatus
    ) {
      return;
    }

    setUpdatingId(issue.id);

    try {

      const {
        data,
        error,
      } = await supabase
        .from('issues')
        .update({
          status: nextStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          issue.id
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedIssue =
        mapSupabaseIssue(
          data || {
            ...issue,
            status: nextStatus,
            updated_at:
              new Date().toISOString(),
          }
        );

      setIssues(
        (currentIssues) =>
          currentIssues.map(
            (item) =>
              item.id === issue.id
                ? {
                    ...item,
                    ...updatedIssue,
                  }
                : item
          )
      );

      setSelected(
        (current) =>
          current &&
          current.id === issue.id
            ? {
                ...current,
                ...updatedIssue,
              }
            : current
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
                Review citizen complaints, AI priority
                assessments, and municipal workflow status.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                fetchIssues(true)
              }
              disabled={refreshing}
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
              value={stats.total}
              icon={
                <AlertTriangle
                  size={20}
                />
              }
            />

            <StatCard
              label="Unresolved"
              value={stats.unresolved}
              icon={
                <Clock
                  size={20}
                />
              }
            />

            <StatCard
              label="Critical"
              value={stats.critical}
              icon={
                <AlertTriangle
                  size={20}
                />
              }
            />

            <StatCard
              label="Resolved"
              value={stats.resolved}
              icon={
                <CheckCircle
                  size={20}
                />
              }
            />

          </div>


          {/* ==========================================
              FILTERS
          ========================================== */}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search issues, category, location, citizen..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />

              </div>


              {/* Status */}

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none"
              >

                <option value="all">
                  All Statuses
                </option>

                {STATUS_ORDER.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {STATUS_LABELS[status]}
                    </option>
                  )
                )}

              </select>


              {/* Priority */}

              <select
                value={filterPriority}
                onChange={(e) =>
                  setFilterPriority(
                    e.target.value
                  )
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none"
              >

                <option value="all">
                  All Priorities
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
              ISSUE TABLE
          ========================================== */}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Citizen Reports
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing {filteredIssues.length} of{' '}
                  {issues.length} issues
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">

                <span className="w-2 h-2 rounded-full bg-teal-500" />

                Live data

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-left">

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Issue
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Citizen
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Reported
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredIssues.map(
                    (issue) => {

                      const priority =
                        issue.aiPriority ||
                        calculatePriorityScore(
                          issue
                        );

                      const nextStatus =
                        getNextStatus(
                          issue.status
                        );

                      return (
                        <tr
                          key={issue.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                        >

                          {/* ISSUE */}

                          <td className="px-4 py-4">

                            <div className="flex items-start gap-3">

                              <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">

                                {issue.photo_url ? (
                                  <ImageIcon
                                    size={18}
                                  />
                                ) : (
                                  <AlertTriangle
                                    size={18}
                                  />
                                )}

                              </div>

                              <div className="min-w-0">

                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[280px]">
                                  {issue.title}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[280px]">
                                  {issue.category}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* CITIZEN */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">

                                <User
                                  size={14}
                                  className="text-slate-500"
                                />

                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {issue.isAnonymous
                                    ? 'Anonymous Citizen'
                                    : issue.citizenName}
                                </p>

                                {issue.isAnonymous && (
                                  <p className="text-[10px] text-slate-400">
                                    Anonymous
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>


                          {/* LOCATION */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">

                              <MapPin
                                size={14}
                                className="text-teal-500 shrink-0"
                              />

                              <span className="max-w-[180px] truncate">
                                {issue.location}
                              </span>

                            </div>

                            {issue.lat &&
                              issue.lng && (
                                <p className="text-[10px] text-slate-400 mt-1">
                                  GPS available
                                </p>
                              )}

                          </td>


                          {/* PRIORITY */}

                          <td className="px-4 py-4 whitespace-nowrap">

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
                                {priority.tier}
                              </span>

                              <span className="text-[11px] font-bold text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                {priority.score}/100
                              </span>

                            </button>

                          </td>


                          {/* STATUS */}

                          <td className="px-4 py-4 whitespace-nowrap">

                            <StatusBadge
                              status={
                                issue.status
                              }
                            />

                          </td>


                          {/* DATE */}

                          <td className="px-4 py-4 whitespace-nowrap">

                            <div className="flex items-center gap-1.5">

                              <Calendar
                                size={13}
                                className="text-slate-400"
                              />

                              <div>

                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                  {getRelativeTime(
                                    issue.createdAt
                                  )}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  {formatDate(
                                    issue.createdAt
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* ACTION */}

                          <td className="px-4 py-4 whitespace-nowrap">

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

        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setSelected(null);
            }
          }}
        >

          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Citizen Issue
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  {selected.title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >

                <X size={20} />

              </button>

            </div>


            <div className="p-5 space-y-5">


              {/* PHOTO */}

              {selected.photo_url && (

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">

                  <img
                    src={selected.photo_url}
                    alt="Citizen submitted issue"
                    className="w-full max-h-[360px] object-cover"
                  />

                </div>

              )}


              {/* BASIC DETAILS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <InfoBox
                  icon={
                    <User size={16} />
                  }
                  label="Reported By"
                  value={
                    selected.isAnonymous
                      ? 'Anonymous Citizen'
                      : selected.citizenName
                  }
                />

                <InfoBox
                  icon={
                    <AlertTriangle
                      size={16}
                    />
                  }
                  label="Category"
                  value={
                    selected.category
                  }
                />

                <InfoBox
                  icon={
                    <MapPin size={16} />
                  }
                  label="Location"
                  value={
                    selected.location
                  }
                />

                <InfoBox
                  icon={
                    <Calendar size={16} />
                  }
                  label="Submitted"
                  value={
                    formatDate(
                      selected.createdAt
                    )
                  }
                />

              </div>


              {/* DESCRIPTION */}

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">

                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Issue Description
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selected.description ||
                    'No description provided.'}
                </p>

              </div>


              {/* STATUS */}

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700">

                <div>

                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Current Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={
                        selected.status
                      }
                    />
                  </div>

                </div>


                {getNextStatus(
                  selected.status
                ) && (

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selected,
                        getNextStatus(
                          selected.status
                        )
                      )
                    }
                    disabled={
                      updatingId ===
                      selected.id
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold disabled:opacity-50"
                  >

                    {updatingId ===
                    selected.id
                      ? 'Updating...'
                      : `Move to ${
                          STATUS_LABELS[
                            getNextStatus(
                              selected.status
                            )
                          ]
                        }`}

                  </button>

                )}

              </div>


              {/* ========================================
                  AI PRIORITY ASSESSMENT
              ======================================== */}

              {selected.aiPriority && (

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
                        Calculated from available complaint data
                      </p>

                    </div>


                    <div className="text-right">

                      <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">

                        {selected.aiPriority.score}

                        <span className="text-sm font-semibold text-slate-400">
                          /100
                        </span>

                      </div>

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          PRIORITY_STYLES[
                            selected.aiPriority
                              .tier
                          ] ||
                          PRIORITY_STYLES.MEDIUM
                        }`}
                      >
                        {
                          selected.aiPriority
                            .tier
                        }
                      </span>

                    </div>

                  </div>


                  {/* SCORE BAR */}

                  <div className="mb-5">

                    <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full ${
                          selected.aiPriority
                            .tier ===
                          'CRITICAL'
                            ? 'bg-red-500'
                            : selected.aiPriority
                                .tier ===
                              'HIGH'
                            ? 'bg-orange-500'
                            : selected.aiPriority
                                .tier ===
                              'MEDIUM'
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              selected
                                .aiPriority
                                .score
                            )
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* REASONS */}

                  <div className="space-y-2">

                    <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                      Why this priority?
                    </p>

                    {(
                      selected.aiPriority
                        .reasons || []
                    ).map(
                      (
                        reason,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >

                          <CheckCircle
                            size={14}
                            className="mt-0.5 shrink-0 text-indigo-500"
                          />

                          <span>
                            {reason}
                          </span>

                        </div>
                      )
                    )}

                  </div>


                  {/* TRUST */}

                  <div className="mt-5 pt-4 border-t border-indigo-100 dark:border-indigo-900">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Report Evidence Score
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Based on available location,
                          photo and description data.
                        </p>

                      </div>

                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {selected.trustScore}
                        <span className="text-xs text-slate-400">
                          /100
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* LOCATION */}

              {(selected.lat &&
                selected.lng) && (

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-2">

                        <MapPin
                          size={17}
                          className="text-teal-500"
                        />

                        <span className="font-bold text-sm text-slate-800 dark:text-white">
                          GPS Location
                        </span>

                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {selected.lat},{' '}
                        {selected.lng}
                      </p>

                    </div>


                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                    >

                      Open Map

                      <ExternalLink
                        size={13}
                      />

                    </a>

                  </div>

                </div>

              )}


              {/* CLOSE */}

              <div className="flex justify-end pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
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
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

      <div className="flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-[10px] uppercase tracking-wider font-bold">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value || '—'}
      </p>

    </div>
  );
}