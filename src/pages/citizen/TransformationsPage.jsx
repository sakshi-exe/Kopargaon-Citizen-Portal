import React from 'react';
import Header from '../../components/ui/Header.jsx';
import TransformationShowcase from '../../components/ui/TransformationShowcase.jsx';

export default function CitizenTransformationsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Infrastructure Transformations"
        subtitle="Verified Before & After comparisons and evidence of Kopargaon municipal upgrades"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <TransformationShowcase />
      </div>
    </div>
  );
}

