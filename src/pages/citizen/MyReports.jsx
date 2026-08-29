import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { MapPin, Clock, AlertCircle } from 'lucide-react';

const STEP_ORDER = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Verified'];

function StatusTimeline({ currentStatus }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {STEP_ORDER.map((step, index) => {
        const active = index <= currentIdx;
        const current = index === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex min-w-[72px] flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-black ${
                current ? 'border-[#0B1324] bg-[#0B1324] text-white' : active ? 'border-[#138808] bg-[#EAF9ED] text-[#138808]' : 'border-[#E8EDF2] bg-[#F8FAFC] text-[#A3B1C4]'
              }`}>
                {index + 1}
              </div>
              <div className={`mt-1 text-[9px] font-bold uppercase tracking-[0.12em] ${active ? 'text-[#0B1324]' : 'text-[#94A3B8]'}`}>
                {step === 'Under Review' ? 'Review' : step}
              </div>
            </div>
            {index < STEP_ORDER.length - 1 && (
              <div className={`h-0.5 flex-1 min-w-[12px] rounded-full ${index < currentIdx ? 'bg-[#138808]' : 'bg-[#E8EDF2]'}`} />
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
    <div className="flex h-full flex-col overflow-hidden">
      <Header title="My reports" subtitle="Track the status of your submitted civic issues" />

      <div className="flex-1 overflow-y-auto p-6">
        {myIssues.length === 0 && (
          <div className="mb-4 rounded-2xl border border-[#E3F0FF] bg-[#F5F9FF] p-3 text-xs font-medium text-[#2B4F8A]">
            Showing sample issues for demonstration. Submit a report via the issue form to see your own reports here.
          </div>
        )}

        {displayIssues.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <AlertCircle size={40} className="mb-3 text-[#94A3B8]" />
            <p className="text-[#52627A]">No reports yet.</p>
            <a href="/citizen/report" className="mt-3 text-sm font-bold text-[#0B1324] underline">Report your first issue →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {displayIssues.map(issue => (
              <div key={issue.id} className="rounded-[28px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">
                      <span>{issue.id}</span>
                      <span>•</span>
                      <span>{issue.category}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-black text-[#0B1324]">{issue.description.length > 90 ? `${issue.description.slice(0, 90)}…` : issue.description}</h3>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-xs text-[#52627A]">
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
