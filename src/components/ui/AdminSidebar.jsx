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
        bg-slate-900
        border-r border-slate-800
        transition-all duration-200
        flex-shrink-0
        ${collapsed ? 'w-16' : 'w-72'}
      `}
    >

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div
        className="
          flex items-center gap-4
          px-5 py-5
          border-b border-slate-800
          flex-shrink-0
        "
      >

        <div
          className="
            w-11 h-11
            bg-blue-600
            rounded-xl
            flex items-center justify-center
            flex-shrink-0
            shadow-sm
          "
        >
          <Building2
            size={23}
            className="text-white"
          />
        </div>

        {!collapsed && (
          <div className="min-w-0">

            <div
              className="
                text-lg
                font-bold
                text-white
                leading-tight
              "
            >
              CivicFix
            </div>

            <div
              className="
                text-xs
                text-blue-400
                font-medium
                mt-0.5
              "
            >
              Kopargaon Admin Center
            </div>

          </div>
        )}

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          py-5
          px-3
        "
      >

        <div className="space-y-2">

          {NAV_ITEMS.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}
              end={!!item.end}
              className={({ isActive }) =>
                `
                  flex items-center
                  gap-4
                  px-4 py-3.5
                  rounded-xl
                  text-base
                  font-medium
                  transition-all duration-150

                  ${
                    isActive
                      ? `
                        bg-blue-600
                        text-white
                        font-semibold
                        shadow-sm
                      `
                      : `
                        text-slate-400
                        hover:bg-slate-800
                        hover:text-white
                      `
                  }

                  ${collapsed ? 'justify-center' : ''}
                `
              }
            >

              <item.icon
                size={21}
                strokeWidth={2}
                className="flex-shrink-0"
              />

              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}

            </NavLink>

          ))}

        </div>

      </nav>


      {/* =====================================================
          SWITCH TO CITIZEN
      ===================================================== */}

      <div
        className="
          px-3
          py-4
          border-t border-slate-800
          flex-shrink-0
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
            text-sm
            font-medium
            text-slate-400
            hover:bg-slate-800
            hover:text-slate-200
            transition-colors
          "
        >

          <ChevronLeft
            size={17}
            className="flex-shrink-0"
          />

          {!collapsed && (
            <span>
              Switch to Citizen View
            </span>
          )}

        </button>


        {!collapsed && (
          <p
            className="
              text-[11px]
              text-slate-500
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