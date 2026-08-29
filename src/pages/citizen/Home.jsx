import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map, AlertCircle, FolderOpen, Eye, ArrowRight, MapPin, Activity,
  QrCode, Sparkles, ShieldCheck, CheckCircle2, Building, ChevronRight,
  TrendingUp, Layers, Check
} from 'lucide-react';
import { useApp, useAnalytics } from '../../context/AppContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { Badge, StatusBadge } from '../../components/ui/Badge.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui/Card.jsx';
import Header from '../../components/ui/Header.jsx';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';

export default function CitizenHome() {
  const { state } = useApp();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const recentIssues = [...state.issues].slice(0, 4);
  const activeProjects = state.projects.filter(p => p.status === 'In Progress').slice(0, 3);
  const featuredTransformation = state.transformations[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Kopargaon Citizen Portal"
        subtitle="Kopargaon Municipal Council · Digital Urban Infrastructure Monitoring Platform"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Hero Municipal Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl">
          {/* Subtle Tricolour Accent Line */}
          <div className="civic-tricolour-stripe absolute top-0 left-0 right-0" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-mono font-bold mb-3.5 border border-saffron-400/30">
              <ShieldCheck size={14} /> KOPARGAON MUNICIPAL COUNCIL · CIVIC TECH PLATFORM
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Transparent Municipal Infrastructure & Public Audit
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-3 leading-relaxed max-w-2xl font-normal">
              Empowering Kopargaon citizens to track public projects, report local grievances, scan physical QR infrastructure tags, and audit town development progress in real-time.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => navigate('/citizen/map')}
                className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-saffron-500/20 flex items-center gap-2"
              >
                <Map size={16} /> Explore City GIS Map
              </button>

              <button
                onClick={() => navigate('/citizen/report')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-white/20 backdrop-blur-sm flex items-center gap-2"
              >
                <AlertCircle size={16} /> Report Civic Issue
              </button>

              <button
                onClick={() => navigate('/citizen/scan-qr')}
                className="px-4 py-2.5 bg-navy-800/80 hover:bg-navy-700 text-blue-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-navy-600/60 flex items-center gap-2"
              >
                <QrCode size={16} /> Scan Asset QR Tag
              </button>

              <button
                onClick={() => navigate('/citizen/transformations')}
                className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-slate-700 flex items-center gap-2"
              >
                <Sparkles size={16} /> Before & After
              </button>
            </div>
          </div>

          <div className="absolute right-6 bottom-4 opacity-5 hidden lg:block pointer-events-none">
            <Building size={220} />
          </div>
        </div>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <StatCard
            title="Total Infrastructure Assets"
            value={analytics.infrastructure.total}
            subtitle={`Avg condition score: ${analytics.infrastructure.avgCondition}/10`}
            icon={Activity}
            iconBg="bg-navy-50 dark:bg-navy-950/60"
            iconColor="text-navy-700 dark:text-navy-300"
            accentColor="#000080"
          />
          <StatCard
            title="Active Municipal Projects"
            value={analytics.projects.activeCount}
            subtitle={`₹${(analytics.projects.totalBudget / 10000000).toFixed(1)} Cr total budget allocated`}
            icon={FolderOpen}
            iconBg="bg-saffron-50 dark:bg-saffron-950/60"
            iconColor="text-saffron-700 dark:text-saffron-300"
            accentColor="#FF9933"
          />
          <StatCard
            title="Citizen Reports Logged"
            value={analytics.issues.total}
            subtitle={`${analytics.issues.unresolvedCount} under active verification & resolution`}
            icon={AlertCircle}
            iconBg="bg-red-50 dark:bg-red-950/60"
            iconColor="text-red-700 dark:text-red-300"
          />
          <StatCard
            title="Public Resolution Rate"
            value={`${analytics.issues.resolutionRate}%`}
            subtitle={`${analytics.issues.resolvedCount} grievance tickets completed`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50 dark:bg-emerald-950/60"
            iconColor="text-emerald-700 dark:text-emerald-300"
            accentColor="#138808"
          />
        </div>

        {/* Featured Transformation Teaser Card */}
        {featuredTransformation && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                  <Sparkles size={14} /> Problem Detection → Solution Spotlight
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                  {featuredTransformation.title}
                </h3>
              </div>
              <Link
                to="/citizen/transformations"
                className="text-xs font-bold text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline"
              >
                View all transformation audits <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-52 group border-2 border-red-200 dark:border-red-900/60 shadow-xs bg-slate-950">
                <img src={featuredTransformation.before.image} alt="Before Our Project" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-red-600/95 text-white text-[11px] font-extrabold shadow backdrop-blur-sm">
                  BEFORE (Condition: {featuredTransformation.before.condition})
                </span>
                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/80 text-white text-[11px] font-medium backdrop-blur-sm">
                  Issues: Potholes • Waterlogging • Uneven Surface
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-52 group border-2 border-emerald-300 dark:border-emerald-800 shadow-xs bg-slate-950">
                <img src={featuredTransformation.after.image} alt="After Our Project" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-emerald-600/95 text-white text-[11px] font-extrabold shadow backdrop-blur-sm">
                  AFTER ({featuredTransformation.after.inspection})
                </span>
                <span className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/80 text-white text-[11px] font-medium backdrop-blur-sm text-emerald-300">
                  ✓ New Road Surface • Smooth Pavement • Road Markings
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Split: Recent Issues & Active Projects */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Recent Civic Issues */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Citizen Complaints</h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Live ticket updates from Kopargaon wards</span>
              </div>
              <Link to="/citizen/map" className="text-xs text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline font-bold">
                View on map <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentIssues.map(issue => (
                <div key={issue.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <MapPin size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/60 px-1.5 py-0.5 rounded border border-navy-200 dark:border-navy-800">{issue.id}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{issue.category}</span>
                      <span className="text-[11px] text-slate-400 font-medium truncate">· {getWardName(issue.wardId)}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1 font-medium">{issue.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">{formatDate(issue.submittedDate)}</div>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active Development Projects</h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">KMC monitored engineering works</span>
              </div>
              <Link to="/citizen/projects" className="text-xs text-navy-700 dark:text-saffron-400 flex items-center gap-1 hover:underline font-bold">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeProjects.map(p => (
                <div key={p.id} className="px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{p.name}</div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">{getWardName(p.wardId)} · Budget: {formatCurrency(p.budget)}</div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                    <div className="h-2 rounded-full bg-navy-600 dark:bg-saffron-500 transition-all duration-300" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="text-right text-[10px] text-slate-400 mt-1 font-bold">{p.progress}% executed</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

