import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CitizenSidebar from '../components/ui/CitizenSidebar.jsx';

export default function CitizenLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <CitizenSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <Outlet />
      </div>
    </div>
  );
}
