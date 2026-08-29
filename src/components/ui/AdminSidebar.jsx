import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Package,
  Layers,
  FolderOpen,
  MessageSquare,
  BarChart2,
  Lightbulb,
  Eye,
  ChevronLeft,
  Building2,
  MapPin,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  {
    to: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard',
    end: true,
  },
  {
    to: '/admin/gis-map',
    icon: Map,
    label: 'GIS Command Centre',
  },
  {
    to: '/admin/field-inspection',
    icon: Wrench,
    label: 'Field Inspection',
  },
  {
    to: '/admin/transformations',
    icon: Sparkles,
    label: 'Before & After',
  },
  {
    to: '/admin/infrastructure',
    icon: Package,
    label: 'Infrastructure',
  },
  {
    to: '/admin/landuse',
    icon: Layers,
    label: 'Land Use',
  },
  {
    to: '/admin/projects',
    icon: FolderOpen,
    label: 'Projects',
  },
  {
    to: '/admin/issues',
    icon: MessageSquare,
    label: 'Citizen Issues',
  },
  {
    to: '/admin/analytics',
    icon: BarChart2,
    label: 'Analytics',
  },
  {
    to: '/admin/insights',
    icon: Lightbulb,
    label: 'Planning Insights',
  },
  {
    to: '/admin/ward-analysis',
    icon: MapPin,
    label: 'Ward Analysis',
  },
  {
    to: '/admin/transparency',
    icon: Eye,
    label: 'Transparency',
  },
];

export default function AdminSidebar({ collapsed = false }) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        flex flex-col h-full
        bg-white
        border-r border-slate-200
        transition-all duration-200
        flex-shrink-0
        ${collapsed ? 'w-16' : 'w-80'}
      `}
    >
      {/* ==================== LOGO ==================== */}
      <div
        className="
          flex items-center gap-3
          px-5 py-5
          border-b border-slate-200
          flex-shrink-0
          bg-white
        "
      >
        {/* Logo */}
        <div
          className="
            w-10 h-10
            bg-teal-500
            rounded-xl
            flex items-center justify-center
            flex-shrink-0
            shadow-sm
          "
        >
          <Building2
            size={21}
            strokeWidth={2}
            className="text-white"
          />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div
              className="
                text-lg
                font-extrabold
                text-slate-900
                leading-tight
              "
            >
              CivicFix
            </div>

            <div
              className="
                text-xs
                text-teal-600
                font-semibold
                mt-0.5
              "
            >
              Kopargaon Admin Center
            </div>
          </div>
        )}
      </div>

      {/* ==================== NAVIGATION ==================== */}
      <nav
        className="
          flex-1
          overflow-y-auto
          py-5
          px-3
          bg-white
        "
      >
        <div className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={!!item.end}
              className={({ isActive }) =>
                `
                  group
                  flex items-center
                  gap-4
                  px-4 py-3
                  rounded-xl
                  text-sm
                  transition-all
                  duration-150
                  border
                  ${
                    isActive
                      ? `
                        bg-teal-50
                        border-teal-100
                        text-teal-700
                        font-bold
                      `
                      : `
                        bg-transparent
                        border-transparent
                        text-slate-600
                        font-semibold
                        hover:bg-slate-50
                        hover:border-slate-100
                        hover:text-slate-900
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.3 : 2}
                    className={`
                      flex-shrink-0
                      transition-colors
                      ${
                        isActive
                          ? 'text-teal-600'
                          : 'text-slate-500 group-hover:text-slate-700'
                      }
                    `}
                  />

                  {!collapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ==================== SWITCH TO CITIZEN ==================== */}
      <div
        className="
          px-3
          py-4
          border-t border-slate-200
          flex-shrink-0
          bg-white
        "
      >
        <button
          onClick={() => {
            dispatch({
              type: 'SET_ROLE',
              payload: 'citizen',
            });

            navigate('/citizen');
          }}
          className="
            w-full
            flex items-center
            gap-3
            px-4 py-3
            rounded-xl
            border border-teal-100
            bg-white
            text-sm
            font-semibold
            text-slate-600
            hover:bg-teal-50
            hover:text-teal-700
            hover:border-teal-200
            transition-all
            duration-150
          "
        >
          <ChevronLeft
            size={17}
            className="text-teal-600 flex-shrink-0"
          />

          {!collapsed && (
            <span className="truncate">
              Switch to Citizen View
            </span>
          )}
        </button>

        {!collapsed && (
          <p
            className="
              text-[11px]
              text-slate-400
              px-4
              mt-2
            "
          >
            Kopargaon Citizen Portal
          </p>
        )}
      </div>
    </aside>
  );
}