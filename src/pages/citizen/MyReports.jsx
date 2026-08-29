import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { formatDate, getRelativeTime } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { fetchMyReportsFromSupabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { MapPin, Clock, AlertCircle, RefreshCw, Image, LogIn, ShieldCheck, CheckCircle2 } from 'lucide-react';

const STEP_ORDER = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Verified'];

function StatusTimeline({ currentStatus }) {
  const normalized = currentStatus === 'Pending' ? 'Reported' : currentStatus;
  const currentIdx = STEP_ORDER.indexOf(normalized) >= 0 ? STEP_ORDER.indexOf(normalized) : 0;

  return (
    <div className="flex items-center gap-1 mt-3 flex-wrap">
      {STEP_ORDER.map((s, i) => {
        const done = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                current ? 'bg-blue-600 border-blue-600 text-white shadow-sm' :
                done ? 'bg-emerald-500 border-emerald-500 text-white' :
                'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                {done && !current ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-0.5 whitespace-nowrap font-medium ${done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                {s === 'Under Review' ? 'Review' : s}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div className={`flex-1 h-0.5 min-w-[8px] mb-3 ${i < currentIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MyReports() {
  const { state, user, openAuthModal } = useApp();
  const [loading, setLoading] = useState(false);
  const [liveReports, setLiveReports] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

  // Load real Supabase reports when user is authenticated
  useEffect(() => {
    async function load() {
      if (user?.id && isSupabaseConfigured) {
        setLoading(true);
        try {
          const data = await fetchMyReportsFromSupabase(user.id);
          const normalized = data.map(r => ({
            id: r.id,
            category: r.category,
            description: r.description,
            wardId: r.ward_id || 'W1',
            status: r.status === 'Pending' ? 'Reported' : r.status,
            priority: r.priority || 'Medium',
            submittedDate: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            updatedDate: r.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            photoUrl: r.report_evidence?.[0]?.file_path || null,
            latitude: r.latitude,
            longitude: r.longitude,
          }));
          setLiveReports(normalized);
        } catch (err) {
          console.warn('Could not fetch live reports:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [user]);

  // Determine what to display:
  // 1. If user logged in and has Supabase reports, display liveReports.
  // 2. If user has session reports in memory (state.myIssues), display them.
  // 3. Otherwise show sample reports with clear notice.
  const displayReports = liveReports.length > 0
    ? liveReports
    : state.myIssues.length > 0
    ? state.myIssues
    : state.issues.slice(0, 4);

  const isDemo = liveReports.length === 0 && state.myIssues.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="My Reports & Civic Tracking"
        subtitle="Real-time lifecycle monitoring of your reported infrastructure issues in Kopargaon"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Auth prompt if not logged in */}
        {!user && (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <LogIn size={16} className="text-blue-500 flex-shrink-0" />
              <span>
                <strong>Sign in to Kopargaon Fix</strong> to view and sync your personal complaint tickets securely with Supabase database.
              </span>
            </div>
            <button
              onClick={openAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap transition-colors"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Live sync badge */}
        {user && (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Authenticated Citizen: <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {liveReports.length} database ticket(s) linked
            </span>
          </div>
        )}

        {isDemo && !loading && (
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            📋 Showing demonstration complaint tickets. Submit an issue via <a href="/citizen/report" className="underline font-bold text-teal-600 dark:text-teal-400">Report Issue</a> to record your own ticket in Supabase.
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
            <RefreshCw size={24} className="animate-spin text-teal-500" />
            <span className="text-xs">Fetching reports from Supabase…</span>
          </div>
        ) : displayReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <AlertCircle size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No reports logged yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              You have not submitted any civic complaints. Help improve Kopargaon by reporting issues in your ward.
            </p>
            <a
              href="/citizen/report"
              className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              Report Your First Issue →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {displayReports.map(issue => (
              <div
                key={issue.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {issue.category}
                      </span>
                      {issue.priority && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          issue.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                          issue.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {issue.priority} Priority
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {issue.description}
                    </h3>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                {/* Evidence Thumbnail if available */}
                {issue.photoUrl && (
                  <div className="my-3">
                    <button
                      type="button"
                      onClick={() => setActivePhoto(issue.photoUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:border-teal-500 transition-colors"
                    >
                      <Image size={13} /> View Attached Evidence Photo
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-teal-500" /> {getWardName(issue.wardId)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Logged {getRelativeTime(issue.submittedDate)}
                  </span>
                  <span>Last Updated: {formatDate(issue.updatedDate)}</span>
                </div>

                <StatusTimeline currentStatus={issue.status} />
              </div>
            ))}
          </div>
        )}

        {/* Modal for photo preview */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div className="max-w-2xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
              <img src={activePhoto} alt="Attached Evidence" className="w-full h-full object-contain rounded-xl" />
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setActivePhoto(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
