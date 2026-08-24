import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function ThemeToggle() {
  const { state, dispatch } = useApp();
  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      title={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
