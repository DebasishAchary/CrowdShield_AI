import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { useCrowdStatus } from '../hooks/useCrowdStatus';
import FlowChart from '../components/analytics/FlowChart';
import ZoneChart from '../components/analytics/ZoneChart';

export const Analytics: React.FC = () => {
  const { zones, flow, timelineHistory, people } = useCrowdStatus();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#0EA5E9]" /> Crowd Telemetry Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Statistical visualization of backend density metrics and spatial directional vectors
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <RefreshCw className="w-3.5 h-3.5 text-[#0EA5E9] animate-spin" />
          <span>Real-time Stream Data</span>
        </div>
      </div>

      {/* Top Chart: People Count Timeline */}
      <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                People Count Timeline
              </h3>
              <p className="text-xs text-slate-400">Live 1000ms polling volume trend graph</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Users className="w-4 h-4 text-[#0EA5E9]" />
            <span>Current: <strong className="text-white">{people} Persons</strong></span>
          </div>
        </div>

        <div className="h-72 w-full">
          {timelineHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              Gathering timeline telemetry data points...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPeople" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorZoneA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="people"
                  name="Total People"
                  stroke="#0EA5E9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPeople)"
                />
                <Area
                  type="monotone"
                  dataKey="zoneA"
                  name="Zone A"
                  stroke="#38BDF8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0.2}
                  fill="url(#colorZoneA)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Grid: Zone Distribution (Pie) & Crowd Flow (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZoneChart zones={zones} />
        <FlowChart flow={flow} />
      </div>
    </div>
  );
};

export default Analytics;
