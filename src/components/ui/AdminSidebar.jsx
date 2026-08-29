import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Wrench, Layers, FolderOpen,
  AlertTriangle, BarChart3, Lightbulb, Grid, Eye,
  ChevronLeft, Building2, Sparkles, LogIn, LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/admin',                  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/gis-map',          icon: Map,             label: 'GIS Command Center' },
  { to: '/admin/field-inspection', icon: Wrench,          label: 'Field Inspection Hub' },
  { to: '/admin/transformations',  icon: Sparkles,        label: 'Before & After Showcase' },
  { to: '/admin/infrastructure',   icon: Wrench,          label: 'Infrastructure' },
  { to: '/admin/landuse',          icon: Layers,          label: 'Land Use Planning' },
  { to: '/admin/projects',         icon: FolderOpen,      label: 'Projects Monitor' },
  { to: '/admin/issues',           icon: AlertTriangle,   label: 'Citizen Issues' },
  { to: '/admin/ward-analysis',    icon: Grid,            label: 'Ward Analysis' },
  { to: '/admin/analytics',        icon: BarChart3,       label: 'Analytics' },
  { to: '/admin/insights',         icon: Lightbulb,       label: 'Planning Insights' },
  { to: '/admin/transparency',     icon: Eye,             label: 'Public Transparency' },
];

export default function AdminSidebar({ collapsed = false }) {
  const { state, dispatch, user, profile, logout, openAuthModal } = useApp();
  const navigate = useNavigate();

  return (
    <aside className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 flex-shrink-0">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Building2 size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white leading-tight">Kopargaon Fix</div>
            <div className="text-[10px] text-blue-400 font-medium">Municipal Admin Console</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Auth Info or Login Button */}
      <div className="p-2 border-t border-slate-800 flex-shrink-0">
        {user ? (
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                {!collapsed && (
                  <span className="font-bold text-white truncate text-[11px]">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <LogOut size={13} />
              </button>
            </div>
            {!collapsed && (
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 font-mono font-bold">
                  {profile?.role || 'Admin'}
                </span>
                <span className="truncate text-slate-400">{user.email}</span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 hover:bg-blue-900/60 text-xs font-bold transition-all shadow-sm"
          >
            <LogIn size={14} />
            {!collapsed && <span>Admin Login</span>}
          </button>
        )}
      </div>

      {/* Switch to Citizen */}
      <div className="px-2 py-2 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={() => { dispatch({ type: 'SET_ROLE', payload: 'citizen' }); navigate('/citizen'); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft size={14} />
          {!collapsed && <span>Switch to Citizen View</span>}
        </button>
      </div>
    </aside>
  );
}
