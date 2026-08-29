import React from 'react';

export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
        shadow-sm ${hover ? 'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer' : ''}
        transition-all duration-150 ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
