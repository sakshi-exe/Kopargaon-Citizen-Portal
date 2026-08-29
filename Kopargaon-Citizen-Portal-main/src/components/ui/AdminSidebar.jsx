import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Package, Layers, FolderOpen,
  MessageSquare, BarChart2, Lightbulb, Eye, ChevronLeft, Building2, MapPin,
  Wrench, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/admin',                  icon: LayoutDashboard, label: 'Dashboard',         end: true },
  { to: '/admin/gis-map',          icon: Map,             label: 'GIS Command Centre' },
  { to: '/admin/field-inspection', icon: Wrench,          label: 'Field Inspection' },
  { to: '/admin/transformations',  icon: Sparkles,        label: 'Before & After' },
  { to: '/admin/infrastructure',   icon: Package,         label: 'Infrastructure' },
  { to: '/admin/landuse',          icon: Layers,          label: 'Land Use' },
  { to: '/admin/projects',         icon: FolderOpen,      label: 'Projects' },
  { to: '/admin/issues',           icon: MessageSquare,   label: 'Citizen Issues' },
  { to: '/admin/analytics',        icon: BarChart2,       label: 'Analytics' },
  { to: '/admin/insights',         icon: Lightbulb,       label: 'Planning Insights' },
  { to: '/admin/ward-analysis',    icon: MapPin,          label: 'Ward Analysis' },
  { to: '/admin/transparency',     icon: Eye,             label: 'Transparency' },
];

export default function AdminSidebar({ collapsed = false }) {
  const { dispatch } = useApp();
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
            <div className="text-sm font-bold text-white leading-tight">CivicFix</div>
            <div className="text-[10px] text-blue-400 font-medium">Kopargaon Admin Center</div>
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
              end={!!item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Switch to Citizen */}
      <div className="px-2 py-3 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={() => { dispatch({ type: 'SET_ROLE', payload: 'citizen' }); navigate('/citizen'); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft size={14} />
          {!collapsed && <span>Switch to Citizen View</span>}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-slate-500 px-3 mt-1">
            Kopargaon Citizen Portal
          </p>
        )}
      </div>
    </aside>
  );
}
