import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CitizenSidebar from '../components/ui/CitizenSidebar.jsx';

export default function CitizenLayout() {
  const [collapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300
          md:relative md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <CitizenSidebar
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">

        {/* Mobile Header */}
        <header className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          <div className="min-w-0">
            <div className="truncate text-base font-bold text-slate-900 dark:text-white">
              CivicFix
            </div>

            <div className="truncate text-[11px] font-medium text-teal-600 dark:text-teal-400">
              Kopargaon Citizen Portal
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>

      </div>
    </div>
  );
}