import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ISSUE_STATUSES, STATUS_FLOW } from '../../data/issues.js';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { MapPin, Clock, AlertCircle } from 'lucide-react';

const STEP_ORDER = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Verified'];

function StatusTimeline({ currentStatus }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {STEP_ORDER.map((s, i) => {
        const done = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div className={`flex flex-col items-center`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                current ? 'bg-blue-600 border-blue-600 text-white' :
                done ? 'bg-green-500 border-green-500 text-white' :
                'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                {done && !current ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-0.5 whitespace-nowrap ${done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                {s === 'Under Review' ? 'Review' : s}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div className={`flex-1 h-0.5 min-w-[8px] mb-3 ${i < currentIdx ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
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
  const allIssues = state.issues.slice(0, 6); // show some seed issues as demo "my reports"
  const displayIssues = myIssues.length > 0 ? myIssues : allIssues;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="My Reports" subtitle="Track the status of your submitted civic issues" />
      <div className="flex-1 overflow-y-auto p-6">

        {myIssues.length === 0 && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
            📋 Showing sample issues for demonstration. Submit a report via <a href="/citizen/report" className="underline font-medium">Report Issue</a> to see your own reports here.
          </div>
        )}

        {displayIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No reports yet.</p>
            <a href="/citizen/report" className="mt-3 text-sm text-teal-600 dark:text-teal-400 hover:underline">Report your first issue →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {displayIssues.map(issue => (
              <div key={issue.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{issue.id}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{issue.category}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {issue.description.length > 80 ? issue.description.slice(0, 80) + '…' : issue.description}
                    </h3>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={11} /> Ward {issue.wardId}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {getRelativeTime(issue.submittedDate)}</span>
                  <span>Updated: {formatDate(issue.updatedDate)}</span>
                </div>

                <StatusTimeline currentStatus={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
