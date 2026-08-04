import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ZoneData } from '../../types/crowd';

interface ZoneChartProps {
  zones: ZoneData;
}

export const ZoneChart: React.FC<ZoneChartProps> = ({ zones }) => {
  const data = [
    { name: 'Zone A (Main Entrance)', value: zones.A || 0, color: '#0EA5E9' },
    { name: 'Zone B (Central Concourse)', value: zones.B || 0, color: '#38BDF8' },
    { name: 'Zone C (VIP Lounge)', value: zones.C || 0, color: '#818CF8' },
    { name: 'Zone D (Emergency Exit)', value: zones.D || 0, color: '#22C55E' },
  ];

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div>
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Zone Density Distribution
          </h3>
          <p className="text-xs text-slate-400">Share of total crowd volume across monitoring sectors</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-[#0EA5E9] border border-slate-800 font-semibold">
          Sector Share
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1E293B" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#94A3B8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ZoneChart;
