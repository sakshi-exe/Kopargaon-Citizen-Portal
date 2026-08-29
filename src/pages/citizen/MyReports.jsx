import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { MapPin, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const STEP_ORDER = [
  'pending',
  'Reported',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Verified',
];

const normalizeStatus = (status) => {
  if (!status) return 'Reported';

  const value = String(status).toLowerCase();

  if (value === 'pending') return 'Reported';

  return status;
};

function StatusTimeline({ currentStatus }) {
  const status = normalizeStatus(currentStatus);

  const currentIdx = STEP_ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {STEP_ORDER.slice(1).map((s, i) => {
        const actualIndex = i + 1;

        const done =
          currentIdx >= actualIndex;

        const current =
          status === s;

        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  current
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : done
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'
                }`}
              >
                {done && !current ? '✓' : i + 1}
              </div>

              <span
                className={`text-[9px] mt-0.5 whitespace-nowrap ${
                  done
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {s === 'Under Review' ? 'Review' : s}
              </span>
            </div>

            {i < STEP_ORDER.slice(1).length - 1 && (
              <div
                className={`flex-1 h-0.5 min-w-[8px] mb-3 ${
                  currentIdx > actualIndex
                    ? 'bg-green-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MyReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (supabaseError) {
        console.error(
          'Supabase My Reports error:',
          supabaseError
        );

        setError(supabaseError.message);
        return;
      }

      setIssues(data || []);
    } catch (err) {
      console.error(
        'Unexpected My Reports error:',
        err
      );

      setError(
        'Unable to load your reports.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <Header
        title="My Reports"
        subtitle="Track the status of your submitted civic issues"
      />

      <div className="flex-1 overflow-y-auto p-6">

        {/* LOADING */}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <RefreshCw
              size={28}
              className="text-teal-600 animate-spin mb-3"
            />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading your reports...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-64 text-center">

            <AlertCircle
              size={40}
              className="text-red-400 mb-3"
            />

            <p className="text-sm text-red-500 mb-3">
              {error}
            </p>

            <button
              onClick={fetchIssues}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          issues.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">

              <AlertCircle
                size={40}
                className="text-slate-300 dark:text-slate-600 mb-3"
              />

              <p className="text-slate-500 dark:text-slate-400">
                No reports yet.
              </p>

              <a
                href="/citizen/report"
                className="mt-3 text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                Report your first issue →
              </a>

            </div>
          )}

        {/* REPORTS */}

        {!loading &&
          !error &&
          issues.length > 0 && (
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
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
                  >

                    {/* HEADER */}

                    <div className="flex items-start justify-between gap-3 mb-2">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="text-xs font-mono text-slate-400">
                            {issue.id}
                          </span>

                          <span className="text-xs text-slate-400">
                            ·
                          </span>

                          <span className="text-xs text-slate-500">
                            {issue.category}
                          </span>

                        </div>

                        <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">

                          {issue.description &&
                          issue.description.length > 80
                            ? `${issue.description.slice(
                                0,
                                80
                              )}…`
                            : issue.description}

                        </h3>

                      </div>

                      <StatusBadge
                        status={displayStatus}
                      />

                    </div>

                    {/* META */}

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3 flex-wrap">

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
                        <div className="text-[11px] text-slate-400 mb-3">
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

                    {/* TIMELINE */}

                    <StatusTimeline
                      currentStatus={
                        displayStatus
                      }
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