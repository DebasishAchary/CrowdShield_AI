import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { CrowdFlow } from '../../types/crowd';

interface FlowCardProps {
  flow: CrowdFlow;
}

export const FlowCard: React.FC<FlowCardProps> = ({ flow }) => {
  const totalMovement = (flow.UP || 0) + (flow.DOWN || 0) + (flow.LEFT || 0) + (flow.RIGHT || 0) + (flow.STATIONARY || 0);

  const directions = [
    { label: 'NORTH / UP', value: flow.UP || 0, icon: ArrowUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'SOUTH / DOWN', value: flow.DOWN || 0, icon: ArrowDown, color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10 border-[#0EA5E9]/30' },
    { label: 'WEST / LEFT', value: flow.LEFT || 0, icon: ArrowLeft, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { label: 'EAST / RIGHT', value: flow.RIGHT || 0, icon: ArrowRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'STATIONARY', value: flow.STATIONARY || 0, icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9]">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              Crowd Flow Direction
            </h3>
            <p className="text-xs text-slate-400">ByteTrack Directional Trajectory Vectors</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-slate-400">Active Vectors</span>
          <div className="text-sm font-bold text-[#0EA5E9]">{totalMovement} P/s</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {directions.map((dir) => {
          const Icon = dir.icon;
          const pct = totalMovement > 0 ? Math.round((dir.value / totalMovement) * 100) : 0;

          return (
            <div
              key={dir.label}
              className={`p-3 rounded-lg border ${dir.bg} flex flex-col justify-between items-center text-center transition-transform hover:scale-105`}
            >
              <Icon className={`w-5 h-5 ${dir.color} mb-1`} />
              <div className="text-lg font-bold font-mono text-white">{dir.value}</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">{dir.label}</div>
              <div className="text-[10px] font-semibold text-slate-300 mt-1 font-mono">{pct}%</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FlowCard;
