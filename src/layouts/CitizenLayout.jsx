import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CitizenSidebar from '../components/ui/CitizenSidebar.jsx';

export default function CitizenLayout() {
  const [collapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CitizenSidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}