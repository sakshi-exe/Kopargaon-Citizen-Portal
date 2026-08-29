import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map, AlertCircle, FolderOpen, ArrowRight, MapPin, Activity,
  QrCode, Sparkles, ShieldCheck, CheckCircle2, Building2,
  Gauge, BarChart3
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
  const activeProjects = state.projects.filter(p => p.status === 'In Progress').slice(0, 3);
  const featuredTransformation = state.transformations[0];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header title="City Command View" subtitle="Kopargaon civic intelligence dashboard" />

      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="relative overflow-hidden rounded-[30px] border border-[#F2D9B6] bg-gradient-to-br from-[#FFF8F3] via-[#FFFEFC] to-[#F3FBF3] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#FF9933]/12 blur-3xl" />
            <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-[#138808]/12 blur-3xl" />
            <div className="relative z-10 text-left">
              <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FFF2E7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#0B1324] shadow-[0_8px_20px_rgba(255,153,51,0.06)]">
                <ShieldCheck size={14} className="text-[#0B1324]" />
                <span>CIVICFIX COMMAND LAYER</span>
              </div>

              <h1 className="mb-10 max-w-[780px] text-left font-black leading-[0.9] tracking-[-0.07em] text-[#0B1324]">
                <span className="block text-[clamp(2.7rem,5.2vw,5.25rem)] text-[#0B1324]">Your City.</span>
                <span className="block text-[clamp(2.7rem,5.2vw,5.25rem)] text-[#FF9933]">Visible.</span>
                <span className="block text-[clamp(2.7rem,5.2vw,5.25rem)] text-[#0B1324]">Verified.</span>
                <span className="block text-[clamp(2.7rem,5.2vw,5.25rem)] text-[#138808]">Accountable.</span>
              </h1>

              <div className="mb-10 h-[6px] w-[320px] max-w-full rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] shadow-[0_0_0_1px_rgba(15,23,42,0.02)]" />

              <p className="max-w-[760px] text-left text-[clamp(1rem,1.15vw,1.5rem)] font-medium leading-[1.5] tracking-[-0.02em] text-[#52627A]">
                CivicFix tracks roads, water lines, public works, complaints and visible progress so citizens can understand what is being built, what needs review, and what has already been verified.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => navigate('/citizen/map')} className="inline-flex items-center gap-2 rounded-xl bg-[#0B1324] px-5 py-3 text-xs font-bold text-white shadow-[0_12px_24px_rgba(11,19,36,0.18)] transition hover:-translate-y-0.5">
                  <Map size={16} /> Explore city map
                </button>
                <button onClick={() => navigate('/citizen/report')} className="inline-flex items-center gap-2 rounded-xl border border-[#FF9933]/30 bg-[#FFF7F1] px-4 py-3 text-xs font-bold text-[#5E3B13]">
                  <AlertCircle size={16} /> Report issue
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#E6F3EC] bg-[#F9FFFB] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#52627A]">Civic pulse</div>
                <h2 className="mt-2 text-2xl font-black text-[#0B1324]">City health</h2>
              </div>
              <div className="rounded-xl bg-[#EAF9ED] p-2 text-[#138808]">
                <Gauge size={18} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#FF9933_0_38%,#E7F0EC_38%_62%,#138808_62%_100%)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center shadow-inner">
                  <div>
                    <div className="text-2xl font-black text-[#0B1324]">82%</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">healthy</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#E8EDF2]">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#52627A]">Infrastructure</div>
                <div className="mt-2 text-xl font-black text-[#0B1324]">{analytics.infrastructure.total}</div>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#E8EDF2]">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#52627A]">Projects</div>
                <div className="mt-2 text-xl font-black text-[#0B1324]">{analytics.projects.activeCount}</div>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#E8EDF2]">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#52627A]">Reports</div>
                <div className="mt-2 text-xl font-black text-[#0B1324]">{analytics.issues.total}</div>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#E8EDF2]">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#52627A]">Verified</div>
                <div className="mt-2 text-xl font-black text-[#0B1324]">{analytics.issues.resolutionRate}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Infrastructure assets" value={analytics.infrastructure.total} subtitle={`Avg condition ${analytics.infrastructure.avgCondition}/10`} icon={Activity} iconBg="bg-[#EEF3FF]" iconColor="text-[#0B1324]" />
          <StatCard title="Active projects" value={analytics.projects.activeCount} subtitle={`${formatCurrency(analytics.projects.totalBudget)} budget`} icon={FolderOpen} iconBg="bg-[#FFF2E6]" iconColor="text-[#FF9933]" />
          <StatCard title="Citizen reports" value={analytics.issues.total} subtitle={`${analytics.issues.unresolvedCount} open`} icon={AlertCircle} iconBg="bg-[#FFF1F1]" iconColor="text-[#D93025]" />
          <StatCard title="Verified resolution" value={`${analytics.issues.resolutionRate}%`} subtitle={`${analytics.issues.resolvedCount} certified`} icon={CheckCircle2} iconBg="bg-[#EAF9ED]" iconColor="text-[#138808]" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52627A]">Civic pulse</div>
                <h3 className="mt-1 text-xl font-black text-[#0B1324]">Infrastructure overview</h3>
              </div>
              <Link to="/citizen/transparency" className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1324]">
                See ledger <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {activeProjects.map(project => (
                <div key={project.id} className="rounded-2xl border border-[#EEF2F5] bg-[#FFFDF9] p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-[#0B1324]">{project.name}</div>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="mb-3 flex items-center gap-3 text-[11px] text-[#52627A]">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {getWardName(project.wardId)}</span>
                    <span>{formatCurrency(project.budget)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF3F8]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFB15F] to-[#138808]" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52627A]">Projects</div>
                  <h3 className="mt-1 text-lg font-black text-[#0B1324]">In progress</h3>
                </div>
                <div className="rounded-xl bg-[#FFF2E6] p-2 text-[#FF9933]">
                  <BarChart3 size={16} />
                </div>
              </div>
              <div className="space-y-3">
                {activeProjects.map(project => (
                  <div key={project.id} className="rounded-2xl bg-[#FFFDF9] p-3 ring-1 ring-[#EEF2F5]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0B1324]">{project.name}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-2 text-[11px] text-[#52627A]">{getWardName(project.wardId)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52627A]">Reports</div>
                  <h3 className="mt-1 text-lg font-black text-[#0B1324]">Citizen reports</h3>
                </div>
                <div className="rounded-xl bg-[#FFF1F1] p-2 text-[#D93025]">
                  <AlertCircle size={16} />
                </div>
              </div>
              <div className="space-y-3">
                {recentIssues.map(issue => (
                  <div key={issue.id} className="rounded-2xl bg-[#FFF9F8] p-3 ring-1 ring-[#F6E3E2]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">{issue.id}</div>
                        <div className="mt-1 text-xs font-semibold text-[#0B1324]">{issue.category}</div>
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>
                    <div className="mt-2 text-[11px] text-[#52627A]">{getWardName(issue.wardId)} · {formatDate(issue.submittedDate)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52627A]">What is happening</div>
              <h3 className="mt-1 text-2xl font-black text-[#0B1324]">Kopargaon at a glance</h3>
            </div>
            <Link to="/citizen/projects" className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1324]">
              View all projects <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {state.projects.slice(0, 3).map(project => (
              <div key={project.id} className="rounded-[24px] border border-[#EEF2F5] bg-[#FFFDF9] p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#52627A]">{project.id}</div>
                  <StatusBadge status={project.status} />
                </div>
                <h4 className="text-lg font-black text-[#0B1324]">{project.name}</h4>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#52627A]">
                  <MapPin size={12} /> {getWardName(project.wardId)}
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEF3F8]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFB15F] to-[#138808]" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">
                  <span>Budget</span>
                  <span>{formatCurrency(project.budget)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">
                  <span>Target</span>
                  <span>{formatDate(project.expectedEnd)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Scan infrastructure QR', href: '/citizen/scan-qr', icon: QrCode, tone: 'bg-[#EAF9ED] text-[#138808]' },
            { title: 'Report an issue', href: '/citizen/report', icon: AlertCircle, tone: 'bg-[#FFF2E6] text-[#FF9933]' },
            { title: 'Explore city map', href: '/citizen/map', icon: Map, tone: 'bg-[#EEF3FF] text-[#0B1324]' },
            { title: 'View project transparency', href: '/citizen/transparency', icon: Building2, tone: 'bg-[#F4F1FF] text-[#5C3AA9]' },
          ].map(item => (
            <button key={item.title} onClick={() => navigate(item.href)} className="rounded-[24px] border border-[#E8EDF2] bg-white p-4 text-left shadow-[0_18px_32px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#FF9933]/30">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}>
                <item.icon size={18} />
              </div>
              <div className="text-lg font-black text-[#0B1324]">{item.title}</div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
