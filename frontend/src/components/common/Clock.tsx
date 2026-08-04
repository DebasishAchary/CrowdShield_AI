import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { formatTimeString } from '../../utils/formatters';

export const Clock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono text-sm shadow-inner">
      <ClockIcon className="w-4 h-4 text-[#0EA5E9] animate-pulse" />
      <span className="text-slate-400 text-xs hidden md:inline">{dateStr}</span>
      <span className="text-slate-100 font-semibold tracking-wider">{formatTimeString(time)}</span>
    </div>
  );
};

export default Clock;
