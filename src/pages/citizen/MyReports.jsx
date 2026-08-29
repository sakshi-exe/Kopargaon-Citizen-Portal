import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import {
  formatDate,
  getRelativeTime,
} from '../../utils/formatters.js';

import {
  MapPin,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';


// ==================================================
// STATUS ORDER
// ==================================================

const STEP_ORDER = [
  'Reported',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Verified',
];


// ==================================================
// NORMALIZE STATUS
// ==================================================

const normalizeStatus = (status) => {
  if (!status) return 'Reported';

  const value = String(status)
    .trim()
    .toLowerCase();

  if (value === 'pending') {
    return 'Reported';
  }

  if (value === 'reported') {
    return 'Reported';
  }

  if (
    value === 'under review' ||
    value === 'under_review'
  ) {
    return 'Under Review';
  }

  if (value === 'assigned') {
    return 'Assigned';
  }

  if (
    value === 'in progress' ||
    value === 'in_progress'
  ) {
    return 'In Progress';
  }

  if (value === 'resolved') {
    return 'Resolved';
  }

  if (value === 'verified') {
    return 'Verified';
  }

  return status;
};


// ==================================================
// STATUS TIMELINE
// ==================================================

function StatusTimeline({ currentStatus }) {
  const status = normalizeStatus(currentStatus);

  const currentIdx = STEP_ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">

      {STEP_ORDER.map((s, i) => {
        const done = currentIdx >= i;
        const current = status === s;

        return (
          <React.Fragment key={s}>

            <div className="flex flex-col items-center">

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  current
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : done
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {done && !current
                  ? '✓'
                  : i + 1}
              </div>

              <span
                className={`text-[9px] mt-0.5 whitespace-nowrap ${
                  done
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {s === 'Under Review'
                  ? 'Review'
                  : s}
              </span>

            </div>

            {i < STEP_ORDER.length - 1 && (
              <div
                className={`flex-1 h-0.5 min-w-[8px] mb-3 ${
                  currentIdx > i
                    ? 'bg-green-500'
                    : 'bg-slate-200'
                }`}
              />
            )}

          </React.Fragment>
        );
      })}

    </div>
  );
}


// ==================================================
// MY REPORTS
// ==================================================

export default function MyReports() {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ==================================================
  // FETCH CURRENT USER REPORTS
  // ==================================================

  const fetchIssues = async () => {

    try {

      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setIssues([]);
        return;
      }

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from('issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        });

      if (supabaseError) {

        console.error(
          'Supabase My Reports error:',
          supabaseError
        );

        throw supabaseError;
      }

      setIssues(data || []);

    } catch (err) {

      console.error(
        'My Reports error:',
        err
      );

      setError(
        err?.message ||
        'Unable to load your reports.'
      );

    } finally {

      setLoading(false);
    }
  };


  // ==================================================
  // INITIAL LOAD + REALTIME
  // ==================================================

  useEffect(() => {

    let channel = null;

    const setupRealtime = async () => {

      await fetchIssues();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      channel = supabase
        .channel(
          `citizen-my-reports-${user.id}`
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'issues',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {

            console.log(
              'My Reports realtime update:',
              payload
            );

            fetchIssues();
          }
        )
        .subscribe((status) => {

          console.log(
            'My Reports realtime status:',
            status
          );

        });

    };

    setupRealtime();

    return () => {

      if (channel) {
        supabase.removeChannel(channel);
      }

    };

  }, []);


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="flex flex-col h-full overflow-hidden bg-white">

        <Header
          title="My Reports"
          subtitle="Track the status of your submitted civic issues"
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="flex flex-col items-center justify-center text-center">

            <RefreshCw
              size={28}
              className="text-teal-600 animate-spin mb-3"
            />

            <p className="text-sm text-slate-500">
              Loading your reports...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (
      <div className="flex flex-col h-full overflow-hidden bg-white">

        <Header
          title="My Reports"
          subtitle="Track the status of your submitted civic issues"
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="flex flex-col items-center justify-center h-64 text-center px-6">

            <AlertCircle
              size={40}
              className="text-red-400 mb-3"
            />

            <p className="text-sm text-red-500 mb-3">
              {error}
            </p>

            <button
              onClick={fetchIssues}
              className="
                px-4
                py-2
                bg-teal-600
                hover:bg-teal-700
                text-white
                rounded-lg
                text-sm
                font-medium
                transition-colors
              "
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      <Header
        title="My Reports"
        subtitle="Track the status of your submitted civic issues"
      />

      <div className="flex-1 overflow-y-auto p-6">


        {/* ==================================================
            EMPTY
        ================================================== */}

        {issues.length === 0 && (

          <div className="flex flex-col items-center justify-center h-64 text-center">

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <AlertCircle
                size={30}
                className="text-slate-400"
              />
            </div>

            <p className="text-slate-500">
              No reports yet.
            </p>

            <a
              href="/citizen/report"
              className="
                mt-3
                text-sm
                text-teal-600
                hover:text-teal-700
                hover:underline
                font-medium
              "
            >
              Report your first issue →
            </a>

          </div>
        )}


        {/* ==================================================
            REPORTS
        ================================================== */}

        {issues.length > 0 && (

          <div className="space-y-4">

            {issues.map((issue) => {

              const displayStatus =
                normalizeStatus(issue.status);

              const submittedDate =
                issue.created_at
                  ? new Date(issue.created_at)
                  : null;

              return (

                <div
                  key={issue.id}
                  className="
                    bg-white
                    rounded-2xl
                    border border-slate-200
                    p-5
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                  "
                >

                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3 mb-2">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-xs font-mono text-slate-400">
                          {issue.id}
                        </span>

                        <span className="text-xs text-slate-300">
                          ·
                        </span>

                        <span className="text-xs text-slate-500 font-medium">
                          {issue.category}
                        </span>

                      </div>

                      <h3 className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-800
                      ">
                        {issue.description &&
                        issue.description.length > 80
                          ? `${issue.description.slice(0, 80)}…`
                          : issue.description}
                      </h3>

                    </div>

                    <StatusBadge
                      status={displayStatus}
                    />

                  </div>


                  {/* META */}

                  <div className="
                    flex
                    items-center
                    gap-4
                    text-xs
                    text-slate-500
                    mb-3
                    flex-wrap
                  ">

                    <span className="flex items-center gap-1">

                      <MapPin size={11} />

                      {issue.location ||
                        'Location selected'}

                    </span>

                    {submittedDate && (

                      <span className="flex items-center gap-1">

                        <Clock size={11} />

                        {getRelativeTime(
                          submittedDate
                        )}

                      </span>

                    )}

                    {submittedDate && (

                      <span>
                        Submitted:{' '}
                        {formatDate(
                          submittedDate
                        )}
                      </span>

                    )}

                  </div>


                  {/* COORDINATES */}

                  {issue.latitude != null &&
                    issue.longitude != null && (

                    <div className="
                      inline-flex
                      items-center
                      text-[11px]
                      text-slate-400
                      bg-slate-50
                      border border-slate-100
                      rounded-lg
                      px-2
                      py-1
                      mb-3
                    ">

                      📍{' '}

                      {Number(
                        issue.latitude
                      ).toFixed(5)}

                      ,{' '}

                      {Number(
                        issue.longitude
                      ).toFixed(5)}

                    </div>

                  )}


                  {/* STATUS TIMELINE */}

                  <StatusTimeline
                    currentStatus={displayStatus}
                  />

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}