import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Map,
  Home,
  AlertCircle,
  ClipboardList,
  FolderOpen,
  Eye,
  ChevronRight,
  Building2,
  QrCode,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  {
    to: '/citizen',
    icon: Home,
    label: 'Home',
  },
  {
    to: '/citizen/map',
    icon: Map,
    label: 'City GIS Map',
  },
  {
    to: '/citizen/scan-qr',
    icon: QrCode,
    label: 'Scan QR Code',
  },
  {
    to: '/citizen/transformations',
    icon: Sparkles,
    label: 'Before & After',
  },
  {
    to: '/citizen/report',
    icon: AlertCircle,
    label: 'Report Issue',
  },
  {
    to: '/citizen/my-reports',
    icon: ClipboardList,
    label: 'My Reports',
  },
  {
    to: '/citizen/projects',
    icon: FolderOpen,
    label: 'Projects',
  },
  {
    to: '/citizen/transparency',
    icon: Eye,
    label: 'Transparency',
  },
];

export default function CitizenSidebar({
  collapsed = false,
  onNavigate,
}) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleAdminSwitch = () => {
    dispatch({
      type: 'SET_ROLE',
      payload: 'admin',
    });

    navigate('/admin');

    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={`
        flex h-full w-80 flex-col
        border-r border-slate-200
        bg-white
        dark:border-slate-800
        dark:bg-slate-900
        ${collapsed ? 'md:w-16' : 'md:w-80'}
      `}
    >

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-sm">
            <Building2
              size={21}
              className="text-white"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-white">
                CivicFix
              </div>

              <div className="truncate text-xs font-medium text-teal-600 dark:text-teal-400">
                Kopargaon Portal
              </div>
            </div>
          )}

        </div>

        {/* Mobile Close Button */}

        <button
          type="button"
          onClick={handleNavigation}
          aria-label="Close menu"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
        >
          <X size={20} />
        </button>

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">

        <div className="space-y-2">

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/citizen'}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <Icon
                  size={20}
                  className="flex-shrink-0"
                />

                {!collapsed && (
                  <span className="min-w-0 truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* =====================================================
          SWITCH TO ADMIN
      ===================================================== */}

      <div className="flex-shrink-0 border-t border-slate-100 px-3 py-4 dark:border-slate-800">

        <button
          type="button"
          onClick={handleAdminSwitch}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ChevronRight
            size={16}
            className="flex-shrink-0"
          />

          {!collapsed && (
            <span className="truncate">
              Switch to Admin View
            </span>
          )}
        </button>

        {!collapsed && (
          <p className="mt-2 px-4 text-[11px] text-slate-400 dark:text-slate-500">
            Kopargaon Municipal Console
          </p>
        )}

      </div>

    </aside>
  );
}