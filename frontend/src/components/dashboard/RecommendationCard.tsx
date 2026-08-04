import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecommendationCardProps {
  recommendations: string[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  const handleExecute = (rec: string) => {
    toast.success(`Action Dispatched: "${rec.slice(0, 35)}..."`, {
      style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid rgba(14, 165, 233, 0.4)',
      },
      icon: '🛡️',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              AI Recommendations
            </h3>
            <p className="text-xs text-slate-400">Automated Crowd Control Mitigation Tactics</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-[#0EA5E9] border border-slate-700 font-semibold">
          {recommendations.length} Active
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No critical recommendations required at present capacity.
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 hover:border-[#0EA5E9]/40 transition-colors flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-medium leading-relaxed">{rec}</span>
              </div>

              <button
                onClick={() => handleExecute(rec)}
                className="px-2.5 py-1 rounded bg-[#0EA5E9]/15 hover:bg-[#0EA5E9] text-[#0EA5E9] hover:text-white border border-[#0EA5E9]/30 text-[11px] font-mono font-semibold transition-all shrink-0 flex items-center gap-1 opacity-90 group-hover:opacity-100"
              >
                Action <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800">
        <span>Engine: Rule-Based DeepSORT Telemetry</span>
        <span>Auto-evaluated</span>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
