import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users } from 'lucide-react';
import { useCrowdStatus } from '../../hooks/useCrowdStatus';

interface ZoneCardProps {
  zoneName: 'A' | 'B' | 'C' | 'D';
  count: number;
  isHighest: boolean;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zoneName, count, isHighest }) => {
  const { settings } = useCrowdStatus();

  // Zone metadata
  const zoneTitles: Record<string, string> = {
    A: 'Main Entrance Gate',
    B: 'Central Concourse',
    C: 'VIP Lounge Area',
    D: 'North Emergency Corridor',
  };

  // Max capacity for meter calculation
  const maxCapacity = 40;
  const percentage = Math.min(100, Math.round((count / maxCapacity) * 100));

  let statusColor = 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
  let barColor = 'bg-gradient-to-r from-emerald-500 to-emerald-400';

  if (count >= settings.highDensityThreshold || count >= 25) {
    statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    barColor = 'bg-gradient-to-r from-rose-500 to-rose-400';
  } else if (count >= settings.mediumDensityThreshold || count >= 15) {
    statusColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    barColor = 'bg-gradient-to-r from-yellow-500 to-amber-400';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#1E293B] rounded-xl p-4 border transition-all ${
        isHighest
          ? 'border-[#0EA5E9]/60 shadow-[0_0_15px_rgba(14,165,233,0.2)] bg-slate-800/90'
          : 'border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-xs flex items-center justify-center text-[#0EA5E9]">
            {zoneName}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              Zone {zoneName}
              {isHighest && (
                <span className="text-[9px] bg-[#0EA5E9]/20 text-[#0EA5E9] px-1.5 py-0.5 rounded border border-[#0EA5E9]/40 font-mono uppercase">
                  Highest Density
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">{zoneTitles[zoneName]}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-base font-extrabold font-mono text-white">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {count}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">People</span>
        </div>
      </div>

      {/* Density Bar */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Density Occupancy</span>
          <span className="font-semibold text-slate-200">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/50 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ZoneCard;
