import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { LayoutDashboard, Video, BarChart2, Settings, Info } from 'lucide-react';
import { useCrowdStatus } from '../hooks/useCrowdStatus';

export const DashboardLayout: React.FC = () => {
  const { isConnected } = useCrowdStatus();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 relative">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 pb-20 md:pb-8">
          {!isConnected && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>
                  <strong>Backend Offline:</strong> Failed to connect to FastAPI backend at <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-rose-400 font-mono">http://10.70.39.245:8000</code>. Displaying simulated fallback telemetry.
                </span>
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1E293B] border-t border-slate-700/80 flex items-center justify-around z-50 px-2 shadow-2xl">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1 transition-colors ${
              isActive ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1 transition-colors ${
              isActive ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Video className="w-5 h-5" />
          <span>Monitoring</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1 transition-colors ${
              isActive ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <BarChart2 className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1 transition-colors ${
              isActive ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1 transition-colors ${
              isActive ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Info className="w-5 h-5" />
          <span>About</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardLayout;
