import React from 'react';
import Header from '../../components/ui/Header.jsx';
import TransformationShowcase from '../../components/ui/TransformationShowcase.jsx';

export default function CitizenTransformationsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      <Header
        title="Infrastructure Transformations"
        subtitle="Verified Before & After comparisons of Kopargaon civic upgrades"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <TransformationShowcase />
      </div>
    </div>
  );
}