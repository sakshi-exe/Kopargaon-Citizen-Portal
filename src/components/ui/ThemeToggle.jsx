import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function ThemeToggle() {
  const { state, dispatch } = useApp();
  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
      className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#FF9933]/25 bg-gradient-to-br from-white via-[#FFF7F1] to-[#F0FBF2] text-[#0B1736] shadow-sm hover:border-[#138808]/35 hover:text-[#000080] dark:border-[#FF9F43]/25 dark:from-[#0E1B2D] dark:via-[#101E30] dark:to-[#122B1E] dark:text-slate-200 dark:hover:border-[#2FBF71]/30"
      title={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
