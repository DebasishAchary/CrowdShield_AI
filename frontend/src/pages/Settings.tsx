import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Save, RotateCcw, Server } from 'lucide-react';
import { useCrowdStatus } from '../hooks/useCrowdStatus';
import toast from 'react-hot-toast';
import { CONFIG } from '../config/config';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useCrowdStatus();

  const [mediumThreshold, setMediumThreshold] = useState<number>(settings.mediumDensityThreshold);
  const [highThreshold, setHighThreshold] = useState<number>(settings.highDensityThreshold);
  const [refreshInterval, setRefreshInterval] = useState<number>(settings.autoRefreshInterval);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      mediumDensityThreshold: Number(mediumThreshold),
      highDensityThreshold: Number(highThreshold),
      autoRefreshInterval: Number(refreshInterval),
    });

    toast.success('Threshold Settings Updated', {
      style: { background: '#1E293B', color: '#fff', border: '1px solid #0EA5E9' },
    });
  };

  const handleResetDefaults = () => {
    setMediumThreshold(CONFIG.DEFAULT_THRESHOLDS.MEDIUM_DENSITY);
    setHighThreshold(CONFIG.DEFAULT_THRESHOLDS.HIGH_DENSITY);
    setRefreshInterval(CONFIG.DEFAULT_THRESHOLDS.AUTO_REFRESH_INTERVAL);

    updateSettings({
      mediumDensityThreshold: CONFIG.DEFAULT_THRESHOLDS.MEDIUM_DENSITY,
      highDensityThreshold: CONFIG.DEFAULT_THRESHOLDS.HIGH_DENSITY,
      autoRefreshInterval: CONFIG.DEFAULT_THRESHOLDS.AUTO_REFRESH_INTERVAL,
    });

    toast('Reset to Default Thresholds', {
      icon: '🔄',
      style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#0EA5E9]" /> System Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure surveillance alarm thresholds and backend telemetry polling properties
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 self-start sm:self-auto">
          Version 1.0 Parameters
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Threshold Configuration Panel */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/60 shadow-lg space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-700/60 pb-3">
            <div className="p-2 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                Density & Alarm Thresholds
              </h3>
              <p className="text-xs text-slate-400">Configure trigger parameters for risk state evaluations</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Medium Density Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-200 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  Medium Density Threshold
                </label>
                <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                  {mediumThreshold} Persons
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={mediumThreshold}
                onChange={(e) => setMediumThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <p className="text-[11px] text-slate-400">
                Trigger medium risk warning alert when total or sector count exceeds this value.
              </p>
            </div>

            {/* High Density Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-200 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  High Density Threshold
                </label>
                <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  {highThreshold} Persons
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Trigger high density critical alarm and automatically activate mitigation protocols.
              </p>
            </div>

            {/* Auto Refresh Interval */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-200 font-semibold flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#0EA5E9]" />
                  Auto Refresh Interval
                </label>
                <span className="text-[#0EA5E9] font-bold bg-[#0EA5E9]/10 px-2 py-0.5 rounded border border-[#0EA5E9]/30">
                  {refreshInterval} ms
                </span>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-mono focus:border-[#0EA5E9] outline-none"
              >
                <option value={500}>500 ms (High Performance / Low Latency)</option>
                <option value={1000}>1000 ms (Default Specification - 1 Second)</option>
                <option value={2000}>2000 ms (2 Seconds)</option>
                <option value={5000}>5000 ms (5 Seconds - Power Saving)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Polling rate for calling <code className="text-[#0EA5E9] font-mono">GET /status</code> on the FastAPI backend.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#0EA5E9] hover:bg-sky-400 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
