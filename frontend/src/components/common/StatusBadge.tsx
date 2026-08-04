import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useCrowdStatus } from '../../hooks/useCrowdStatus';

export const StatusBadge: React.FC = () => {
  const { isConnected, isSimulationMode, toggleSimulationMode, refreshData } = useCrowdStatus();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-xs tracking-wide transition-all ${
          isConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {isConnected ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
        </span>
        {isConnected ? (
          <span className="flex items-center gap-1.5 font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            Backend Connected
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            Backend Offline
          </span>
        )}
      </div>

      {!isConnected && (
        <button
          onClick={toggleSimulationMode}
          title="Toggle fallback simulation mode to test UI during offline status"
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isSimulationMode
              ? 'bg-[#0EA5E9]/15 border-[#0EA5E9]/40 text-[#0EA5E9] hover:bg-[#0EA5E9]/25'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isSimulationMode ? 'animate-spin' : ''}`} />
          {isSimulationMode ? 'Simulated Data' : 'Enable Sim'}
        </button>
      )}
    </div>
  );
};

export default StatusBadge;
