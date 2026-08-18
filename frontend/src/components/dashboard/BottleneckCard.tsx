import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import { BottleneckInfo } from '../../types/crowd';

interface BottleneckCardProps {
  bottleneck: BottleneckInfo | string;
}

/**
 * Normalise the bottleneck value coming from either:
 *  - the live backend  →  { bottleneck: bool, zone: string|null, reason: string }
 *  - the simulation    →  same object shape (updated in CrowdContext)
 *  - legacy string     →  plain text (kept for safety)
 */
function normalise(bottleneck: BottleneckInfo | string): { isDetected: boolean; label: string } {
  if (typeof bottleneck === 'string') {
    const detected =
      bottleneck.toLowerCase().includes('detected') ||
      bottleneck.toLowerCase().includes('zone');
    return { isDetected: detected, label: bottleneck };
  }

  // BottleneckInfo object shape
  if (bottleneck.bottleneck) {
    const label = bottleneck.reason
      ? bottleneck.reason
      : bottleneck.zone
      ? `Detected in ${bottleneck.zone}`
      : 'Bottleneck Detected';
    return { isDetected: true, label };
  }

  return { isDetected: false, label: 'No Bottleneck Detected' };
}

export const BottleneckCard: React.FC<BottleneckCardProps> = ({ bottleneck }) => {
  const { isDetected, label } = normalise(bottleneck);

  return (
    <div
      className={`bg-[#1E293B] rounded-xl p-5 border transition-all ${
        isDetected
          ? 'border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_20px_rgba(250,204,21,0.12)]'
          : 'border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            Bottleneck Status
          </span>
          <div className="text-lg font-bold text-white mt-1.5 font-mono leading-tight">
            {label}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl shrink-0 ${
            isDetected ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' : 'bg-emerald-500/15 text-emerald-400'
          }`}
        >
          {isDetected ? <AlertOctagon className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
        <span
          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
            isDetected
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}
        >
          {isDetected ? 'CONGESTION WARNING' : 'FLOW OPTIMAL'}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">ByteTrack Engine</span>
      </div>
    </div>
  );
};

export default BottleneckCard;
