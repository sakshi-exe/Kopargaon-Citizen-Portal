import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  MapPin,
  Activity,
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from 'lucide-react';

import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import Header from '../../components/ui/Header.jsx';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';

export default function CitizenHome() {
  const { state } = useApp();
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const recentIssues = [...state.issues].slice(0, 4);

  const activeProjects = state.projects
    .filter((p) => p.status === 'In Progress')
    .slice(0, 3);

  const featuredTransformation = state.transformations[0];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* Header */}
      <Header
        title="CivicFix — Kopargaon Citizen Portal"
        subtitle="Kopargaon Municipal Council · Digital Urban Infrastructure Monitoring"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

        {/* =========================================================
            HERO SECTION
        ========================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg p-7 sm:p-9">

          {/* Soft tri-colour background accents */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-teal-100/70 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />

          <div className="absolute right-20 bottom-0 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

          <div className="absolute left-1/2 top-0 w-56 h-56 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">

            {/* Pilot Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-mono font-bold mb-4 border border-teal-200">
              <ShieldCheck size={14} />
              KOPARGAON MUNICIPAL COUNCIL PILOT
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl">
              Kopargaon's Digital Infrastructure Monitoring Platform
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
              Connect infrastructure, citizen feedback, development projects,
              and GIS data in one transparent platform. Scan civic QR tags for
              public audit history.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">

              {/* Map */}
              <button
                onClick={() => navigate('/citizen/map')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Map size={16} />
                Explore Kopargaon Map
              </button>

              {/* Report */}
              <button
                onClick={() => navigate('/citizen/report')}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-slate-300 shadow-sm flex items-center gap-2"
              >
                <AlertCircle size={16} />
                Report an Issue
              </button>

              {/* QR */}
              <button
                onClick={() => navigate('/citizen/scan-qr')}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-blue-200 flex items-center gap-2"
              >
                <QrCode size={16} />
                Scan Infrastructure QR
              </button>

              {/* Before / After */}
              <button
                onClick={() => navigate('/citizen/transformations')}
                className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-orange-200 flex items-center gap-2"
              >
                <Sparkles size={16} />
                Before & After
              </button>

            </div>
          </div>

          {/* Building Illustration */}
          <div className="absolute right-6 top-8 text-teal-600 opacity-[0.08] hidden md:block pointer-events-none">
            <Building2 size={240} />
          </div>
        </div>


        {/* =========================================================
            QUICK STATISTICS
        ========================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatCard
            title="Total Infrastructure Assets"
            value={analytics.infrastructure.total}
            subtitle={`Avg condition: ${analytics.infrastructure.avgCondition}/10`}
            icon={Activity}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Active Kopargaon Projects"
            value={analytics.projects.activeCount}
            subtitle={`₹${(analytics.projects.totalBudget / 10000000).toFixed(1)} Cr total budget`}
            icon={FolderOpen}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Citizen Reports Logged"
            value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} under active resolution`}
            icon={AlertCircle}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />

          <StatCard
            title="Resolution & Verified Rate"
            value={`${analytics.issues.resolutionRate}%`}
            subtitle={`${analytics.issues.resolvedCount} tickets certified`}
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

        </div>


        {/* =========================================================
            FEATURED TRANSFORMATION
        ========================================================== */}
        {featuredTransformation && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">

              <div>

                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                  <Sparkles size={14} />
                  Problem Detection → Solution Spotlight
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {featuredTransformation.title}
                </h3>

              </div>

              <Link
                to="/citizen/transformations"
                className="text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline"
              >
                View all 6 transformations
                <ArrowRight size={13} />
              </Link>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* BEFORE */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-56 group border-2 border-red-200 shadow-sm bg-white">

                <img
                  src={featuredTransformation.before.image}
                  alt="Before Our Project"
                  className="w-full h-full object-cover"
                />

                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-extrabold shadow">
                  BEFORE OUR PROJECT · Poor Condition
                </span>

                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/95 text-slate-700 text-[11px] font-medium shadow-sm border border-slate-200">
                  Issues: Potholes • Waterlogging • Uneven Surface
                </span>

              </div>


              {/* AFTER */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-56 group border-2 border-emerald-300 shadow-sm bg-white">

                <img
                  src={featuredTransformation.after.image}
                  alt="After Our Project"
                  className="w-full h-full object-cover"
                />

                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shadow">
                  AFTER OUR PROJECT · Improved Condition
                </span>

                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/95 text-emerald-700 text-[11px] font-medium shadow-sm border border-emerald-100">
                  ✓ New Road Surface • Smooth Pavement • Road Markings
                </span>

              </div>

            </div>
          </div>
        )}


        {/* =========================================================
            RECENT ISSUES + ACTIVE PROJECTS
        ========================================================== */}
        <div className="grid md:grid-cols-2 gap-6">


          {/* =======================================================
              RECENT CITIZEN ISSUES
          ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

              <div>

                <h3 className="font-bold text-slate-800 text-sm">
                  Recent Citizen Complaints
                </h3>

                <span className="text-[11px] text-slate-500">
                  Live ticket updates from Kopargaon wards
                </span>

              </div>

              <Link
                to="/citizen/map"
                className="text-xs text-teal-600 flex items-center gap-1 hover:underline font-medium"
              >
                View on map
                <ArrowRight size={12} />
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >

                  <MapPin
                    size={15}
                    className="text-slate-400 mt-0.5 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2">

                      <span className="text-[11px] font-mono font-bold text-blue-600">
                        {issue.id}
                      </span>

                      <span className="text-xs font-semibold text-slate-800">
                        {issue.category}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        · {getWardName(issue.wardId)}
                      </span>

                    </div>

                    <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {issue.description}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {formatDate(issue.submittedDate)}
                    </div>

                  </div>

                  <StatusBadge status={issue.status} />

                </div>
              ))}

            </div>
          </div>


          {/* =======================================================
              ACTIVE PROJECTS
          ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

              <div>

                <h3 className="font-bold text-slate-800 text-sm">
                  Active Development Projects
                </h3>

                <span className="text-[11px] text-slate-500">
                  KMC monitored engineering works
                </span>

              </div>

              <Link
                to="/citizen/projects"
                className="text-xs text-teal-600 flex items-center gap-1 hover:underline font-medium"
              >
                View all
                <ArrowRight size={12} />
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >

                  <div className="flex items-start justify-between gap-2 mb-1">

                    <div className="text-xs font-bold text-slate-800 leading-snug">
                      {p.name}
                    </div>

                    <StatusBadge status={p.status} />

                  </div>

                  <div className="text-[11px] text-slate-500 mb-2">
                    {getWardName(p.wardId)} · Budget:{' '}
                    {formatCurrency(p.budget)}
                  </div>


                  {/* Progress */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">

                    <div
                      className="h-1.5 rounded-full bg-teal-500"
                      style={{ width: `${p.progress}%` }}
                    />

                  </div>

                  <div className="text-right text-[10px] text-slate-400 mt-1 font-medium">
                    {p.progress}% executed
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}