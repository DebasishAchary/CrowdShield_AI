import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { CrowdFlow } from '../../types/crowd';

interface FlowChartProps {
  flow: CrowdFlow;
}

export const FlowChart: React.FC<FlowChartProps> = ({ flow }) => {
  const data = [
    { direction: 'UP (North)', value: flow.UP || 0, color: '#0EA5E9' },
    { direction: 'DOWN (South)', value: flow.DOWN || 0, color: '#38BDF8' },
    { direction: 'LEFT (West)', value: flow.LEFT || 0, color: '#818CF8' },
    { direction: 'RIGHT (East)', value: flow.RIGHT || 0, color: '#22C55E' },
    { direction: 'STATIONARY', value: flow.STATIONARY || 0, color: '#FACC15' },
  ];

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div>
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Crowd Flow Vector Distribution
          </h3>
          <p className="text-xs text-slate-400">ByteTrack Trajectory Direction Breakdown</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-[#0EA5E9] border border-slate-800 font-semibold">
          Recharts Engine
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="direction" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
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
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FlowChart;
