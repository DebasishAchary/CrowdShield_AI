import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldAlert, Cpu, Github, Code, CheckCircle, ExternalLink } from 'lucide-react';
import { CONFIG } from '../config/config';

export const About: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
            <Info className="w-6 h-6 text-[#0EA5E9]" /> About CrowdShield AI
          </h2>
          <p className="text-xs text-slate-400">
            Autonomous Crowd Analytics & Surveillance Command Center System Overview
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
          Version 1.0 Production
        </span>
      </div>

      {/* Hero Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 rounded-xl p-6 border border-[#0EA5E9]/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">CrowdShield AI Command Center</h3>
            <p className="text-xs text-slate-300">FastAPI + YOLOv8 + ByteTrack Telemetry Pipeline</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          <strong>CrowdShield AI</strong> is a next-generation autonomous crowd surveillance and hazard mitigation system designed for high-density public hubs, stadiums, and transportation hubs. It visualizes real-time telemetry from computer vision detection models without running computationally heavy inference on the client side.
        </p>
      </div>

      {/* Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Architecture */}
        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm border-b border-slate-700/60 pb-2">
            <Cpu className="w-4 h-4 text-[#0EA5E9]" />
            <span>Architecture Breakdown</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">YOLO Person Detection:</strong> High-speed bounding box localization for crowd density estimation.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">ByteTrack Multi-Object Tracking:</strong> Trajectory vector calculations (UP, DOWN, LEFT, RIGHT, STATIONARY).
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">FastAPI Backend ({CONFIG.API_BASE_URL}):</strong> Restful telemetry endpoints serving status every 1000ms.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">React Command Center:</strong> Pure presentation layer visualization with zero client-side AI overhead.
              </div>
            </li>
          </ul>
        </div>

        {/* Technology Stack */}
        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm border-b border-slate-700/60 pb-2">
            <Code className="w-4 h-4 text-[#0EA5E9]" />
            <span>Technology Stack</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Framework</div>
              <div className="text-slate-200 font-bold">React 19 + Vite</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Language</div>
              <div className="text-slate-200 font-bold">TypeScript</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Styling</div>
              <div className="text-slate-200 font-bold">Tailwind CSS</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Animations</div>
              <div className="text-slate-200 font-bold">Framer Motion</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Charts</div>
              <div className="text-slate-200 font-bold">Recharts</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">HTTP Client</div>
              <div className="text-slate-200 font-bold">Axios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Credits & Repository */}
      <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-400 font-mono">Team Members</div>
          <div className="text-sm font-bold text-white font-mono mt-1">CrowdShield AI Ops Team</div>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-mono">GitHub Repository</div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#0EA5E9] hover:underline font-mono mt-1 flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>github.com/crowdshield-ai</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-mono">Developer Credits</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-1">
            Senior Frontend Engineer • AI Surveillance Engineering
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
