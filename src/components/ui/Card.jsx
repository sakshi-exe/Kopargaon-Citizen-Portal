import React from 'react';

export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800
        shadow-xs ${hover ? 'hover:shadow-md hover:border-navy-300 dark:hover:border-navy-600 cursor-pointer' : ''}
        transition-all duration-200 ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`}>
      {children}
    </p>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-4.5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
}

