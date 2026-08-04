import React from 'react';
import { motion } from 'framer-motion';
import { Video, Users, AlertTriangle, MapPin, Lightbulb } from 'lucide-react';
import { useCrowdStatus } from '../hooks/useCrowdStatus';

import VideoPlayer from '../components/monitoring/VideoPlayer';
import UploadVideo from '../components/monitoring/UploadVideo';
import { getRiskBadgeColor } from '../utils/formatters';

export const Monitoring: React.FC = () => {
  const { people, risk, highestZone, recommendations } = useCrowdStatus();
  const riskStyle = getRiskBadgeColor(risk);

  const topRecommendation = recommendations.length > 0
    ? recommendations[0]
    : 'All zone parameters within nominal range.';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
            <Video className="w-6 h-6 text-[#0EA5E9]" /> Live Stream Monitoring
          </h2>
          <p className="text-xs text-slate-400">
            Single stream high-definition surveillance telemetry inspection
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>CAM-01 ACTIVE</span>
        </div>
      </div>

      {/* Main Video Stream Container */}
      <div className="space-y-4">
        <VideoPlayer />

        {/* Telemetry Metrics Below Video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/60 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Current People</div>
              <div className="text-xl font-bold font-mono text-white">{people} Detected</div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/60 flex items-center gap-3">
            <div className={`p-3 rounded-lg ${riskStyle.bg} ${riskStyle.text}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Current Risk</div>
              <div className={`text-xl font-bold font-mono ${riskStyle.text}`}>{risk}</div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/60 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/15 text-yellow-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Current Peak Zone</div>
              <div className="text-xl font-bold font-mono text-white">{highestZone}</div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/60 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] text-slate-400 font-mono">Current Recommendation</div>
              <div className="text-xs font-semibold text-slate-200 truncate" title={topRecommendation}>
                {topRecommendation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Custom Video Section */}
      <UploadVideo />
    </div>
  );
};

export default Monitoring;
