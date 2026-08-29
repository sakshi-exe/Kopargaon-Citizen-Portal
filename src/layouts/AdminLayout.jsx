import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/ui/AdminSidebar.jsx';

export default function AdminLayout() {
  const [collapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <AdminSidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
        <main className="flex-1 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}