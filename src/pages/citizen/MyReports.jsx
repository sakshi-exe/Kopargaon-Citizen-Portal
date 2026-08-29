import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ISSUE_STATUSES, STATUS_FLOW } from '../../data/issues.js';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { MapPin, Clock, AlertCircle, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

const STEP_ORDER = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Verified'];

function StatusTimeline({ currentStatus }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-1">
      {STEP_ORDER.map((s, i) => {
        const done = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                isCurrent
                  ? 'bg-saffron-500 border-saffron-500 text-slate-950 shadow-xs'
                  : done
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] font-semibold mt-1 whitespace-nowrap ${
                isCurrent ? 'text-saffron-700 dark:text-saffron-400 font-bold' : done ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
              }`}>
                {s === 'Under Review' ? 'Review' : s}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div className={`flex-1 h-0.5 min-w-[12px] mb-4.5 rounded-full ${
                i < currentIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MyReports() {
  const { state } = useApp();
  const myIssues = state.myIssues;
  const allIssues = state.issues.slice(0, 6);
  const displayIssues = myIssues.length > 0 ? myIssues : allIssues;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="My Reports & Grievance Tracking"
        subtitle="Track live status, inspection progress, and municipal resolution for your submitted tickets"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4">

        {myIssues.length === 0 && (
          <div className="p-3.5 rounded-2xl bg-navy-50/80 dark:bg-navy-950/40 border border-navy-200 dark:border-navy-800/80 text-xs text-navy-900 dark:text-navy-200 flex items-center justify-between gap-3">
            <span>📋 Showing sample municipal complaints. Submit your own report to track live field resolution.</span>
            <Link to="/citizen/report" className="font-bold text-navy-700 dark:text-saffron-400 hover:underline flex-shrink-0 flex items-center gap-1">
              Report Issue <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {displayIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 shadow-xs">
            <AlertCircle size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No reports logged yet.</p>
            <Link to="/citizen/report" className="mt-2 text-xs font-bold text-navy-700 dark:text-saffron-400 hover:underline">
              Submit your first report →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayIssues.map(issue => (
              <div
                key={issue.id}
                className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded-md border border-navy-200 dark:border-navy-800">
                        {issue.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {issue.category}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {issue.description}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 self-start">
                    <StatusBadge status={issue.status} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" /> {getWardName(issue.wardId)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" /> {getRelativeTime(issue.submittedDate)}
                  </span>
                  <span>·</span>
                  <span>Updated: {formatDate(issue.updatedDate)}</span>
                </div>

                {/* Progress Pipeline */}
                <StatusTimeline currentStatus={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
