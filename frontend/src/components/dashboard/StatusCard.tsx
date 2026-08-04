import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorTheme: 'primary' | 'success' | 'warning' | 'danger';
  badge?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorTheme,
  badge,
}) => {
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'primary':
        return {
          border: 'border-[#0EA5E9]/30 hover:border-[#0EA5E9]/60',
          iconBg: 'bg-[#0EA5E9]/15 text-[#0EA5E9]',
          glow: 'shadow-[0_0_20px_rgba(14,165,233,0.12)]',
          badgeStyle: 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/40',
        };
      case 'success':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          iconBg: 'bg-emerald-500/15 text-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.12)]',
          badgeStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'warning':
        return {
          border: 'border-yellow-500/30 hover:border-yellow-500/60',
          iconBg: 'bg-yellow-500/15 text-yellow-400',
          glow: 'shadow-[0_0_20px_rgba(250,204,21,0.12)]',
          badgeStyle: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        };
      case 'danger':
        return {
          border: 'border-rose-500/40 hover:border-rose-500/70',
          iconBg: 'bg-rose-500/15 text-rose-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.18)]',
          badgeStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#1E293B] rounded-xl p-5 border ${theme.border} ${theme.glow} transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight group-hover:scale-105 transition-transform duration-200 origin-left">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium line-clamp-1">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${theme.iconBg} shrink-0 transition-transform group-hover:rotate-6`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {badge && (
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${theme.badgeStyle}`}>
            {badge}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Live Telemetry</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatusCard;
