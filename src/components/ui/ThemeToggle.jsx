import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function ThemeToggle({ className = '' }) {
  const { state, dispatch } = useApp();
  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
      className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 transition-all ${className}`}
      title={state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle visual theme"
    >
      {state.darkMode ? (
        <Sun size={17} className="text-saffron-400" />
      ) : (
        <Moon size={17} className="text-navy-700" />
      )}
    </button>
  );
}

