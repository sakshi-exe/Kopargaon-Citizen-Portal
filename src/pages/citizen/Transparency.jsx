import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { formatDate, formatCurrency, getBudgetUtilization } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import {
  Eye, IndianRupee, Calendar, MapPin, CheckCircle, ShieldCheck,
  QrCode
} from 'lucide-react';

export default function CitizenTransparency() {
  const { state, dispatch } = useApp();
  const publicProjects = state.projects;
  const completedCount = publicProjects.filter(p => p.status === 'Completed').length;
  const totalBudget = publicProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = publicProjects.reduce((s, p) => s + p.spent, 0);

  const handleOpenAsset = (p) => {
    const asset = state.infrastructure.find(i => i.id === p.qrAssetRef) || {
      id: p.id,
      name: p.name,
      type: p.category,
      wardId: p.wardId,
      condition: p.status === 'Completed' ? 9 : 6,
      installDate: p.startDate,
      lastInspection: p.expectedEnd,
      maintenanceStatus: p.status === 'Completed' ? 'Up-to-date' : 'Due',
      contractor: p.contractor,
      budget: p.budget,
      citizenReports: 0,
      description: p.description,
      maintenanceHistory: p.updates ? p.updates.map(u => ({ date: u.date, action: u.text })) : []
    };
    dispatch({ type: 'OPEN_ASSET_MODAL', payload: asset });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header title="Know where your city's money goes." subtitle="Transparent public works ledger for Kopargaon" />

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <section className="relative overflow-hidden rounded-[30px] border border-[#F2D9B6] bg-gradient-to-br from-[#FFF8F3] via-[#FFFEFC] to-[#F2FBF5] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.07)]">
          <div className="absolute -left-12 top-2 h-36 w-36 rounded-full bg-[#FF9933]/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[#138808]/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FFF2E7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1324]">
                <ShieldCheck size={14} /> Public accountability
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-[#0B1324] sm:text-4xl">
                Verify the work behind every civic asset.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#52627A] sm:text-base">
                Every project in the civic ledger can be traced to the contractor, budget, inspection record, progress, and completion target used by the municipal administration.
              </p>
            </div>

            <div className="grid w-full max-w-xl gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#EEF2F5] bg-white/90 p-4 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52627A]">Public works</div>
                <div className="mt-2 text-2xl font-black text-[#0B1324]">{publicProjects.length}</div>
              </div>
              <div className="rounded-[22px] border border-[#EEF2F5] bg-white/90 p-4 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52627A]">Verified</div>
                <div className="mt-2 text-2xl font-black text-[#138808]">{completedCount}</div>
              </div>
              <div className="rounded-[22px] border border-[#EEF2F5] bg-white/90 p-4 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52627A]">Utilisation</div>
                <div className="mt-2 text-2xl font-black text-[#FF9933]">{Math.round((totalSpent / totalBudget) * 100 || 0)}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-[#EEF2F5] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52627A]">Projects</div>
              <Eye size={18} className="text-[#0B1324]" />
            </div>
            <div className="text-3xl font-black text-[#0B1324]">{publicProjects.length}</div>
            <div className="mt-1 text-xs text-[#52627A]">Published and traceable</div>
          </div>
          <div className="rounded-[24px] border border-[#EEF2F5] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52627A]">Verified</div>
              <CheckCircle size={18} className="text-[#138808]" />
            </div>
            <div className="text-3xl font-black text-[#138808]">{completedCount}</div>
            <div className="mt-1 text-xs text-[#52627A]">Completed and audited</div>
          </div>
          <div className="rounded-[24px] border border-[#EEF2F5] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52627A]">Budget</div>
              <IndianRupee size={18} className="text-[#FF9933]" />
            </div>
            <div className="text-xl font-black text-[#0B1324]">{formatCurrency(totalBudget)}</div>
            <div className="mt-1 text-xs text-[#52627A]">Approved expenditure</div>
          </div>
          <div className="rounded-[24px] border border-[#EEF2F5] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52627A]">Utilisation</div>
              <ShieldCheck size={18} className="text-[#138808]" />
            </div>
            <div className="text-xl font-black text-[#138808]">{formatCurrency(totalSpent)}</div>
            <div className="mt-1 text-xs text-[#52627A]">Spent against approved budget</div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E8EDF2] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52627A]">Municipal project ledger</div>
              <h3 className="mt-1 text-xl font-black text-[#0B1324]">Public works register</h3>
            </div>
            <div className="rounded-full border border-[#E8EDF2] bg-[#FFFDF8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52627A]">Updated Aug 2026</div>
          </div>

          <div className="space-y-3">
            {publicProjects.map(project => (
              <div key={project.id} className="rounded-[20px] border border-[#EEF2F5] bg-[#FFFDF9] p-4">
                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr_0.7fr]">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Project</div>
                    <div className="mt-1 text-sm font-black text-[#0B1324]">{project.name}</div>
                    <div className="mt-1 font-mono text-[10px] font-bold uppercase text-[#0B1324]">{project.id}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Ward</div>
                    <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#0B1324]">
                      <MapPin size={12} className="text-[#138808]" />
                      {getWardName(project.wardId)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Contractor</div>
                    <div className="mt-1 text-sm font-semibold text-[#0B1324]">{project.contractor || 'KMC Engineering Div'}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Budget</div>
                    <div className="mt-1 text-sm font-bold text-[#0B1324]">{formatCurrency(project.budget)}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Progress</div>
                    <div className="mt-2">
                      <ProgressBar value={project.progress} color="auto" size="sm" showLabel />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52627A]">Status</div>
                      <div className="mt-1"><StatusBadge status={project.status} /></div>
                    </div>
                    <button onClick={() => handleOpenAsset(project)} className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#E6EEF5] bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B1324]">
                      <QrCode size={12} /> profile
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF2F5] pt-3 text-[11px] text-[#52627A]">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(project.expectedEnd)}</span>
                  <span>Utilisation: {getBudgetUtilization(project.spent, project.budget)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
