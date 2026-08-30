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
// STATUS HELPERS
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
  critical:
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',

  high:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',

  medium:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',

  low:
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
  if (value === 'assigned') return 'assigned';
  if (value === 'working') return 'in_progress';
  if (value === 'completed') return 'resolved';

  return 'pending';
}


// ======================================================
// AI SCORE
// ======================================================

function calculatePriorityScore(issue) {
  if (
    typeof issue.ai_score === 'number'
  ) {
    return issue.ai_score;
  }

  if (
    typeof issue.priority_score === 'number'
  ) {
    return issue.priority_score;
  }

  const priority =
    String(issue.priority || 'medium').toLowerCase();

  if (priority === 'critical') return 90;
  if (priority === 'high') return 75;
  if (priority === 'low') return 30;

  return 50;
}


// ======================================================
// MAP SUPABASE ISSUE
// ======================================================

function mapSupabaseIssue(issue) {
  const status = normalizeStatus(issue.status);

  return {
    ...issue,

    id: issue.id,

    title:
      issue.title ||
      issue.description?.slice(0, 60) ||
      'Civic Issue',

    description:
      issue.description || '',

    category:
      issue.category || 'Other',

    priority:
      String(issue.priority || 'medium').toLowerCase(),

    status,

    displayStatus:
      STATUS_LABELS[status] || 'Reported',

    citizenName:
      issue.citizen_name || 'Citizen',

    location:
      issue.location || 'Kopargaon',

    lat:
      issue.latitude,

    lng:
      issue.longitude,

    photo_url:
      issue.photo_url || null,

    createdAt:
      issue.created_at
        ? new Date(issue.created_at)
        : null,

    updatedAt:
      issue.updated_at
        ? new Date(issue.updated_at)
        : null,

    aiScore:
      calculatePriorityScore(issue),
  };
}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(date) {
  if (!date) return '—';

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
    ).format(date);
  } catch {
    return '—';
  }
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function CitizenIssues() {

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const [filterStatus, setFilterStatus] =
    useState('all');

  const [filterPriority, setFilterPriority] =
    useState('all');

  const [updatingId, setUpdatingId] =
    useState(null);


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
          { ascending: false }
        );

      if (error) {
        console.error(
          'Failed to fetch issues:',
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
  // FILTER
  // ==================================================

  const filteredIssues = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return issues.filter((issue) => {

      const matchesSearch =
        !query ||
        issue.title
          ?.toLowerCase()
          .includes(query) ||
        issue.description
          ?.toLowerCase()
          .includes(query) ||
        issue.citizenName
          ?.toLowerCase()
          .includes(query) ||
        issue.location
          ?.toLowerCase()
          .includes(query) ||
        issue.category
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        filterStatus === 'all' ||
        issue.status === filterStatus;

      const matchesPriority =
        filterPriority === 'all' ||
        issue.priority === filterPriority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

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

    const total = issues.length;

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
          issue.priority === 'critical'
      ).length;

    const high =
      issues.filter(
        (issue) =>
          issue.priority === 'high'
      ).length;

    return {
      total,
      unresolved,
      critical,
      high,
    };

  }, [issues]);


  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const updateStatus = async (
    issue,
    newStatus
  ) => {

    setUpdatingId(issue.id);

    try {

      const {
        error,
      } = await supabase
        .from('issues')
        .update({
          status: newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          issue.id
        );

      if (error) {
        throw error;
      }

      setIssues((current) =>
        current.map((item) =>
          item.id === issue.id
            ? {
                ...item,
                status: newStatus,
                displayStatus:
                  STATUS_LABELS[
                    newStatus
                  ],
                updatedAt:
                  new Date(),
              }
            : item
        )
      );

      setSelected((current) =>
        current?.id === issue.id
          ? {
              ...current,
              status: newStatus,
              displayStatus:
                STATUS_LABELS[
                  newStatus
                ],
              updatedAt:
                new Date(),
            }
          : current
      );

    } catch (error) {

      console.error(
        'Status update failed:',
        error
      );

      alert(
        `Failed to update status:\n\n${error.message}`
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ==================================================
  // NEXT STATUS
  // ==================================================

  const advanceStatus = async (
    issue
  ) => {

    const currentIndex =
      STATUS_ORDER.indexOf(
        issue.status
      );

    if (
      currentIndex < 0 ||
      currentIndex >=
        STATUS_ORDER.length - 1
    ) {
      return;
    }

    const nextStatus =
      STATUS_ORDER[
        currentIndex + 1
      ];

    await updateStatus(
      issue,
      nextStatus
    );
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="flex flex-col h-full">

        <Header
          title="Citizen Issues"
          subtitle="Kopargaon Citizen Issues Triage"
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="flex items-center gap-3 text-slate-500">

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


          {/* ==================================================
              TOP STATS
          ================================================== */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              label="Total Issues"
              value={stats.total}
              icon={<AlertTriangle size={20} />}
            />

            <StatCard
              label="Unresolved"
              value={stats.unresolved}
              icon={<Clock size={20} />}
            />

            <StatCard
              label="Critical"
              value={stats.critical}
              icon={<AlertTriangle size={20} />}
            />

            <StatCard
              label="High Priority"
              value={stats.high}
              icon={<Brain size={20} />}
            />

          </div>


          {/* ==================================================
              FILTER BAR
          ================================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search issues, citizens, wards..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20"
                />

              </div>


              {/* STATUS */}

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >

                <option value="all">
                  All Status
                </option>

                {STATUS_ORDER.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
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
                value={filterPriority}
                onChange={(e) =>
                  setFilterPriority(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >

                <option value="all">
                  All Priority
                </option>

                <option value="critical">
                  Critical
                </option>

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>

              </select>


              {/* REFRESH */}

              <button
                type="button"
                onClick={() =>
                  fetchIssues(true)
                }
                disabled={refreshing}
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
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

          </div>


          {/* ==================================================
              ISSUES LIST
          ================================================== */}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Citizen Reports
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  {filteredIssues.length} issue
                  {filteredIssues.length !== 1
                    ? 's'
                    : ''}{' '}
                  shown
                </p>

              </div>

            </div>


            {filteredIssues.length === 0 ? (

              <div className="py-16 text-center">

                <CheckCircle
                  size={38}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="font-medium text-slate-700 dark:text-slate-300">
                  No citizen issues found
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Try changing your filters.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredIssues.map(
                  (issue) => (

                    <IssueRow
                      key={issue.id}
                      issue={issue}
                      onView={() =>
                        setSelected(
                          issue
                        )
                      }
                    />

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

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

          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">

              <div className="pr-4">

                <div className="flex items-center gap-2 mb-1">

                  <span className="text-xs font-mono text-slate-400">
                    {selected.id}
                  </span>

                  <PriorityBadge
                    priority={
                      selected.priority
                    }
                  />

                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selected.title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={19} />
              </button>

            </div>


            <div className="p-6 space-y-5">


              {/* ==================================================
                  PHOTO
              ================================================== */}

              {selected.photo_url ? (

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">

                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <ImageIcon
                        size={16}
                        className="text-teal-600"
                      />

                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Citizen Uploaded Evidence
                      </span>

                    </div>

                    <a
                      href={
                        selected.photo_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      Open Full Image
                      <ExternalLink
                        size={12}
                      />
                    </a>

                  </div>

                  <div className="bg-slate-100 dark:bg-slate-950 p-3">

                    <img
                      src={
                        selected.photo_url
                      }
                      alt="Citizen reported issue"
                      className="w-full max-h-[420px] object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />

                  </div>

                </div>

              ) : (

                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">

                  <ImageIcon
                    size={32}
                    className="mx-auto text-slate-300 mb-2"
                  />

                  <p className="text-sm text-slate-500">
                    No photo uploaded
                  </p>

                </div>

              )}


              {/* ==================================================
                  AI + STATUS
              ================================================== */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <InfoBox
                  icon={
                    <Brain
                      size={16}
                    />
                  }
                  label="AI Priority"
                  value={
                    `${selected.aiScore}/100`
                  }
                />

                <InfoBox
                  icon={
                    <AlertTriangle
                      size={16}
                    />
                  }
                  label="Priority"
                  value={
                    selected.priority
                      .toUpperCase()
                  }
                />

                <InfoBox
                  icon={
                    <Clock
                      size={16}
                    />
                  }
                  label="Status"
                  value={
                    selected.displayStatus
                  }
                />

              </div>


              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">

                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  Issue Description
                </div>

                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {selected.description ||
                    'No description provided.'}
                </p>

              </div>


              {/* ==================================================
                  DETAILS
              ================================================== */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <DetailItem
                  icon={
                    <User size={16} />
                  }
                  label="Citizen"
                  value={
                    selected.citizenName
                  }
                />

                <DetailItem
                  icon={
                    <MapPin size={16} />
                  }
                  label="Location / Ward"
                  value={
                    selected.location
                  }
                />

                <DetailItem
                  icon={
                    <Calendar size={16} />
                  }
                  label="Reported"
                  value={
                    formatDate(
                      selected.createdAt
                    )
                  }
                />

                <DetailItem
                  icon={
                    <Calendar size={16} />
                  }
                  label="Last Updated"
                  value={
                    formatDate(
                      selected.updatedAt
                    )
                  }
                />

                <DetailItem
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

                <DetailItem
                  icon={
                    <MapPin size={16} />
                  }
                  label="Coordinates"
                  value={
                    selected.lat != null &&
                    selected.lng != null
                      ? `${Number(
                          selected.lat
                        ).toFixed(
                          6
                        )}, ${Number(
                          selected.lng
                        ).toFixed(
                          6
                        )}`
                      : 'Not available'
                  }
                />

              </div>


              {/* ==================================================
                  STATUS WORKFLOW
              ================================================== */}

              <div className="border-t border-slate-200 dark:border-slate-800 pt-5">

                <div className="flex items-center justify-between mb-3">

                  <div>

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Workflow Status
                    </h3>

                    <p className="text-xs text-slate-500">
                      Update the issue as municipal work progresses.
                    </p>

                  </div>

                  {selected.status !==
                    'verified' && (

                    <button
                      type="button"
                      onClick={() =>
                        advanceStatus(
                          selected
                        )
                      }
                      disabled={
                        updatingId ===
                        selected.id
                      }
                      className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-50"
                    >

                      {updatingId ===
                      selected.id
                        ? 'Updating...'
                        : 'Advance Status →'}

                    </button>

                  )}

                </div>


                <div className="flex flex-wrap gap-2">

                  {STATUS_ORDER.map(
                    (status, index) => {

                      const currentIndex =
                        STATUS_ORDER.indexOf(
                          selected.status
                        );

                      const active =
                        index <=
                        currentIndex;

                      return (
                        <div
                          key={status}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                            active
                              ? STATUS_STYLES[
                                  status
                                ]
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          }`}
                        >

                          {active ? (
                            <CheckCircle
                              size={13}
                            />
                          ) : (
                            <Clock
                              size={13}
                            />
                          )}

                          {
                            STATUS_LABELS[
                              status
                            ]
                          }

                        </div>
                      );
                    }
                  )}

                </div>


                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">

                  {STATUS_ORDER.map(
                    (status) => (

                      <button
                        key={status}
                        type="button"
                        disabled={
                          updatingId ===
                          selected.id ||
                          status ===
                            selected.status
                        }
                        onClick={() =>
                          updateStatus(
                            selected,
                            status
                          )
                        }
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                          status ===
                          selected.status
                            ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        } disabled:opacity-50`}
                      >

                        {
                          STATUS_LABELS[
                            status
                          ]
                        }

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// ======================================================
// ISSUE ROW
// ======================================================

function IssueRow({
  issue,
  onView,
}) {

  return (
    <div className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">

      <div className="flex flex-col lg:flex-row gap-4">

        {/* PHOTO THUMBNAIL */}

        <div className="shrink-0">

          {issue.photo_url ? (

            <img
              src={issue.photo_url}
              alt=""
              className="w-24 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
            />

          ) : (

            <div className="w-24 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">

              <ImageIcon
                size={22}
                className="text-slate-300"
              />

            </div>

          )}

        </div>


        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2 mb-1">

            <span className="font-mono text-[10px] text-slate-400">
              {issue.id}
            </span>

            <PriorityBadge
              priority={
                issue.priority
              }
            />

            <span
              className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                STATUS_STYLES[
                  issue.status
                ]
              }`}
            >
              {issue.displayStatus}
            </span>

          </div>


          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            {issue.title}
          </h3>


          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {issue.description}
          </p>


          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400">

            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {issue.location}
            </span>

            <span>
              {issue.citizenName}
            </span>

            <span>
              {formatDate(
                issue.createdAt
              )}
            </span>

            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Brain size={12} />
              AI Score: {issue.aiScore}
            </span>

          </div>

        </div>


        {/* VIEW */}

        <div className="flex items-center">

          <button
            type="button"
            onClick={onView}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 flex items-center gap-2"
          >

            <Eye size={16} />

            View

          </button>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// PRIORITY BADGE
// ======================================================

function PriorityBadge({
  priority,
}) {

  const value =
    String(
      priority || 'medium'
    ).toLowerCase();

  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
        PRIORITY_STYLES[value] ||
        PRIORITY_STYLES.medium
      }`}
    >
      {value}
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </p>

        </div>

        <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          {icon}
        </div>

      </div>

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

      <div className="flex items-center gap-2 text-slate-400 mb-2">

        {icon}

        <span className="text-[10px] uppercase tracking-wider font-bold">
          {label}
        </span>

      </div>

      <p className="font-bold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  icon,
  label,
  value,
}) {

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">

      <div className="flex items-center gap-2 text-slate-400 mb-1">

        {icon}

        <span className="text-[10px] uppercase tracking-wider font-bold">
          {label}
        </span>

      </div>

      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-words">
        {value}
      </p>

    </div>
  );
}