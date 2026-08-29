import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/ui/AdminSidebar.jsx';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <AdminSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <Outlet />
      </div>
    </div>
  );
}
