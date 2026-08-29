import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/ui/AdminSidebar.jsx';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 font-sans">
      {/* Top Tricolour National Civic Accent Line */}
      <div className="civic-tricolour-stripe flex-shrink-0 z-50" />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Admin Command Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Command Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC] dark:bg-[#090D16]">
          <Outlet context={{ onMenuToggle: () => setMobileOpen(o => !o) }} />
        </div>
      </div>
    </div>
  );
}

