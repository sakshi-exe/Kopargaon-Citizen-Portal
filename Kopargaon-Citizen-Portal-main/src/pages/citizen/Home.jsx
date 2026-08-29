import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map, AlertCircle, FolderOpen, Eye, ArrowRight, MapPin, Activity,
  QrCode, Sparkles, ShieldCheck, CheckCircle2, Building2
} from 'lucide-react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { Badge, StatusBadge } from '../../components/ui/Badge.jsx';
import Header from '../../components/ui/Header.jsx';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';

export default function CitizenHome() {
  const { state, dispatch } = useApp();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const recentIssues = [...state.issues].slice(0, 4);
  const activeProjects = state.projects.filter(p => p.status === 'In Progress').slice(0, 3);
  const featuredTransformation = state.transformations[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="CivicFix — Kopargaon Citizen Portal"
        subtitle="Kopargaon Municipal Council · Digital Urban Infrastructure Monitoring"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Hero Municipal Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-7 sm:p-9 border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold mb-3 border border-teal-400/30">
              <ShieldCheck size={14} /> KOPARGAON MUNICIPAL COUNCIL PILOT
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kopargaon's Digital Infrastructure Monitoring Platform
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
              Connect infrastructure, citizen feedback, development projects, and GIS data in one transparent platform. Scan civic QR tags for public audit history.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => navigate('/citizen/map')}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Map size={16} /> Explore Kopargaon Map
              </button>

              <button
                onClick={() => navigate('/citizen/report')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-slate-700 flex items-center gap-2"
              >
                <AlertCircle size={16} /> Report an Issue
              </button>

              <button
                onClick={() => navigate('/citizen/scan-qr')}
                className="px-4 py-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-blue-400/30 flex items-center gap-2"
              >
                <QrCode size={16} /> Scan Infrastructure QR
              </button>

              <button
                onClick={() => navigate('/citizen/transformations')}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-amber-400/30 flex items-center gap-2"
              >
                <Sparkles size={16} /> Before & After
              </button>
            </div>
          </div>

          <div className="absolute right-6 top-8 opacity-10 hidden md:block pointer-events-none">
            <Building2 size={240} />
          </div>
        </div>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Infrastructure Assets"
            value={analytics.infrastructure.total}
            subtitle={`Avg condition: ${analytics.infrastructure.avgCondition}/10`}
            icon={Activity}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Active Kopargaon Projects"
            value={analytics.projects.activeCount}
            subtitle={`₹${(analytics.projects.totalBudget / 10000000).toFixed(1)} Cr total budget`}
            icon={FolderOpen}
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            title="Citizen Reports Logged"
            value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} under active resolution`}
            icon={AlertCircle}
            iconBg="bg-red-100 dark:bg-red-900/30"
            iconColor="text-red-600 dark:text-red-400"
          />
          <StatCard
            title="Resolution & Verified Rate"
            value={`${analytics.issues.resolutionRate}%`}
            subtitle={`${analytics.issues.resolvedCount} tickets certified`}
            icon={CheckCircle2}
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* Featured Transformation Teaser Card */}
        {featuredTransformation && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  <Sparkles size={14} /> Problem Detection → Solution Spotlight
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {featuredTransformation.title}
                </h3>
              </div>
              <Link
                to="/citizen/transformations"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
              >
                View all 6 transformations <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-56 group border-2 border-red-200 dark:border-red-900/60 shadow-sm bg-slate-950">
                <img src={featuredTransformation.before.image} alt="Before Our Project" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-red-600/90 text-white text-xs font-extrabold shadow backdrop-blur-sm">
                  BEFORE OUR PROJECT · Poor Condition
                </span>
                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-[11px] font-medium backdrop-blur-sm">
                  Issues: Potholes • Waterlogging • Uneven Surface
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-56 group border-2 border-emerald-300 dark:border-emerald-800 shadow-sm bg-slate-950">
                <img src={featuredTransformation.after.image} alt="After Our Project" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-extrabold shadow backdrop-blur-sm">
                  AFTER OUR PROJECT · Improved Condition
                </span>
                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-[11px] font-medium backdrop-blur-sm text-emerald-300">
                  ✓ New Road Surface • Smooth Pavement • Road Markings
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Split: Recent Issues & Active Projects */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Recent Civic Issues */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Recent Citizen Complaints</h3>
                <span className="text-[11px] text-slate-500">Live ticket updates from Kopargaon wards</span>
              </div>
              <Link to="/citizen/map" className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline font-medium">
                View on map <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentIssues.map(issue => (
                <div key={issue.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <MapPin size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">{issue.id}</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{issue.category}</span>
                      <span className="text-[11px] text-slate-400">· {getWardName(issue.wardId)}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">{issue.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{formatDate(issue.submittedDate)}</div>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Active Development Projects</h3>
                <span className="text-[11px] text-slate-500">KMC monitored engineering works</span>
              </div>
              <Link to="/citizen/projects" className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline font-medium">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {activeProjects.map(p => (
                <div key={p.id} className="px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{p.name}</div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">{getWardName(p.wardId)} · Budget: {formatCurrency(p.budget)}</div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="text-right text-[10px] text-slate-400 mt-1 font-medium">{p.progress}% executed</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
