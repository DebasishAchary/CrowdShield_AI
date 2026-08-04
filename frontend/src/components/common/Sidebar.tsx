import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Video, BarChart2, Settings as SettingsIcon, Info, Shield, Radio } from 'lucide-react';
import { useCrowdStatus } from '../../hooks/useCrowdStatus';
import { getRiskBadgeColor } from '../../utils/formatters';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Live Monitoring', path: '/monitoring', icon: Video },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
  { name: 'About', path: '/about', icon: Info },
];

export const Sidebar: React.FC = () => {
  const { people, risk, isConnected } = useCrowdStatus();
  const riskStyle = getRiskBadgeColor(risk);

  return (
    <aside className="w-64 bg-[#1E293B] border-r border-slate-700/60 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0 hidden md:flex">
      {/* Navigation items */}
      <div className="p-4 space-y-6">
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0EA5E9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live System Status Widget */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#0EA5E9] animate-pulse" /> Live Telemetry
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border} border`}>
              {risk}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Total Count</div>
              <div className="text-base font-bold text-white font-mono">{people}</div>
            </div>
            <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Engine API</div>
              <div className={`text-xs font-bold font-mono ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isConnected ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-700/60 bg-slate-900/40">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <Shield className="w-4 h-4 text-[#0EA5E9]" />
          <span>YOLOv8 + ByteTrack</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          FastAPI Engine v1.0 • Command Center
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
