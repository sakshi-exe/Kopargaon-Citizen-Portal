import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Package, Layers, FolderOpen,
  MessageSquare, BarChart2, Lightbulb, Eye, ChevronLeft, MapPin,
  Wrench, Sparkles, X, ChevronRight, User
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_GROUPS = [
  {
    title: 'Operations & GIS',
    items: [
      { to: '/admin',                  icon: LayoutDashboard, label: 'Dashboard',         end: true },
      { to: '/admin/gis-map',          icon: Map,             label: 'GIS Command Centre' },
      { to: '/admin/field-inspection', icon: Wrench,          label: 'Field Inspection' },
      { to: '/admin/transformations',  icon: Sparkles,        label: 'Before & After' },
    ]
  },
  {
    title: 'Municipal Assets',
    items: [
      { to: '/admin/infrastructure',   icon: Package,         label: 'Infrastructure' },
      { to: '/admin/landuse',          icon: Layers,          label: 'Land Use' },
      { to: '/admin/projects',         icon: FolderOpen,      label: 'Projects' },
      { to: '/admin/issues',           icon: MessageSquare,   label: 'Citizen Issues' },
    ]
  },
  {
    title: 'Intelligence & Audit',
    items: [
      { to: '/admin/analytics',        icon: BarChart2,       label: 'Analytics' },
      { to: '/admin/insights',         icon: Lightbulb,       label: 'Planning Insights' },
      { to: '/admin/ward-analysis',    icon: MapPin,          label: 'Ward Analysis' },
      { to: '/admin/transparency',     icon: Eye,             label: 'Transparency' },
    ]
  }
];

export default function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full bg-[#0A1128] border-r border-slate-800
        transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'md:w-16' : 'md:w-64'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/90 flex-shrink-0 bg-slate-950/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center flex-shrink-0 shadow-sm border border-navy-700">
            {/* Ashoka Chakra vector */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-saffron-400 fill-none stroke-current stroke-[1.75]" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-saffron-500 border-2 border-slate-900" />
          </div>

          {(!collapsed || mobileOpen) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                  CivicFix
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-navy-800 text-blue-300 border border-navy-700">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-1">
                Kopargaon Command Center
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={group.title} className="space-y-0.5">
            {(!collapsed || mobileOpen) && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
            )}
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={!!item.end}
                onClick={() => { if (mobileOpen && onCloseMobile) onCloseMobile(); }}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-navy-800/90 text-white font-bold shadow-xs border border-navy-700'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`
                }
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Accent Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-saffron-500" />
                    )}
                    <item.icon
                      size={17}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-saffron-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / Switch View & Collapse */}
      <div className="p-2 border-t border-slate-800/90 bg-slate-950/40 flex-shrink-0 space-y-1.5">
        <button
          onClick={() => {
            dispatch({ type: 'SET_ROLE', payload: 'citizen' });
            navigate('/citizen');
            if (mobileOpen && onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
          title="Switch to Citizen Portal"
        >
          <div className="flex items-center gap-2 min-w-0">
            <User size={14} className="text-saffron-400 flex-shrink-0" />
            {(!collapsed || mobileOpen) && (
              <span className="truncate text-[11px]">Citizen Portal</span>
            )}
          </div>
          {(!collapsed || mobileOpen) && <ChevronRight size={13} className="text-slate-500 flex-shrink-0" />}
        </button>

        {/* Desktop Collapse / Expand Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

