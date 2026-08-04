import React from 'react';
import { ShieldAlert, User, Bell, Activity } from 'lucide-react';
import Clock from './Clock';
import StatusBadge from './StatusBadge';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-[#1E293B]/90 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-lg">
      {/* Brand & Project Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(14,165,233,0.4)] flex items-center justify-center">
          <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#0EA5E9]" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight text-white font-mono uppercase">
              CrowdShield <span className="text-[#0EA5E9]">AI</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#0EA5E9]/15 text-[#0EA5E9] rounded-md border border-[#0EA5E9]/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Autonomous Crowd Surveillance Command Center
          </p>
        </div>
      </div>

      {/* Middle/Right Navigation Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend Status Indicator */}
        <StatusBadge />

        {/* Current Live Time */}
        <Clock />

        {/* System Alert Bell */}
        <button
          className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors relative"
          title="System Notifications"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0EA5E9] rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0EA5E9] rounded-full"></span>
        </button>

        {/* Profile Icon */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 hover:border-[#0EA5E9] transition-colors cursor-pointer shadow-sm group">
            <User className="w-4 h-4 text-slate-300 group-hover:text-[#0EA5E9] transition-colors" />
          </div>
          <div className="hidden xl:block">
            <div className="text-xs font-semibold text-white">Commander Ops</div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#22C55E]" /> Level 1 Operator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
