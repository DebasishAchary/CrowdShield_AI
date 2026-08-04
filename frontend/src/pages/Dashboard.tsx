import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MapPin } from 'lucide-react';
import { useCrowdStatus } from '../hooks/useCrowdStatus';

import StatusCard from '../components/dashboard/StatusCard';
import BottleneckCard from '../components/dashboard/BottleneckCard';
import VideoPlayer from '../components/monitoring/VideoPlayer';
import ZoneCard from '../components/dashboard/ZoneCard';
import FlowCard from '../components/dashboard/FlowCard';
import RecommendationCard from '../components/dashboard/RecommendationCard';

export const Dashboard: React.FC = () => {
  const { people, risk, highestZone, zones, flow, recommendations, bottleneck } = useCrowdStatus();

  // Determine risk card theme
  const getRiskTheme = () => {
    switch (risk) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
      case 'CRITICAL':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
            Surveillance Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Real-time automated crowd telemetry powered by YOLOv8 & ByteTrack
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-ping"></span>
          <span>1000ms Auto-Polling Active</span>
        </div>
      </div>

      {/* Top Row Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="People Count"
          value={people}
          subtitle="Total detected individuals"
          icon={Users}
          colorTheme="primary"
          badge="BYTE-TRACK"
        />

        <StatusCard
          title="Risk Level"
          value={risk}
          subtitle="AI Predicted Hazard Index"
          icon={AlertTriangle}
          colorTheme={getRiskTheme()}
          badge="SAFE DENSITY METER"
        />

        <StatusCard
          title="Highest Risk Zone"
          value={highestZone}
          subtitle="Sector with maximum density"
          icon={MapPin}
          colorTheme="warning"
          badge="CONGESTION PEAK"
        />

        <BottleneckCard bottleneck={bottleneck} />
      </div>

      {/* Middle Section: Left Live Video Player, Right Zone Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left - Video Player (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 px-1">
            Processed Surveillance Feed
          </h3>
          <VideoPlayer />
        </div>

        {/* Right - Zone Statistics (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Sector Zone Statistics
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">4 Sectors Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <ZoneCard zoneName="A" count={zones.A || 0} isHighest={highestZone === 'Zone A'} />
            <ZoneCard zoneName="B" count={zones.B || 0} isHighest={highestZone === 'Zone B'} />
            <ZoneCard zoneName="C" count={zones.C || 0} isHighest={highestZone === 'Zone C'} />
            <ZoneCard zoneName="D" count={zones.D || 0} isHighest={highestZone === 'Zone D'} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Crowd Flow & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <FlowCard flow={flow} />
        </div>
        <div className="lg:col-span-6">
          <RecommendationCard recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
