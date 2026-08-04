import React, { useState } from 'react';
import { Upload, Play, Square, RotateCcw, FileVideo, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const UploadVideo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleFileChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setSelectedFile(fileName);
      toast.success(`Video Loaded: ${fileName}`, {
        style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' },
      });
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      toast.error('Please select a video file first!', {
        style: { background: '#1E293B', color: '#fff', border: '1px solid #EF4444' },
      });
      return;
    }
    setIsAnalyzing(true);
    toast.success('YOLOv8 + ByteTrack Analysis Started', {
      style: { background: '#1E293B', color: '#fff', border: '1px solid #0EA5E9' },
    });
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    toast('Analysis Stopped', {
      icon: '⏹️',
      style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' },
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsAnalyzing(false);
    toast('Video Reset', {
      icon: '🔄',
      style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' },
    });
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div>
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Custom Video Analysis
          </h3>
          <p className="text-xs text-slate-400">Upload recorded CCTV footage for batch AI analysis</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30">
          UI Prepared (v1.0)
        </span>
      </div>

      {/* Upload Dropzone UI */}
      <label className="border-2 border-dashed border-slate-700 hover:border-[#0EA5E9]/60 bg-slate-900/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
        <input type="file" accept="video/*" onChange={handleFileChoose} className="hidden" />
        <div className="p-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-[#0EA5E9] group-hover:bg-[#0EA5E9]/10 transition-colors mb-2">
          <Upload className="w-6 h-6" />
        </div>
        {selectedFile ? (
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
            <FileVideo className="w-4 h-4" />
            <span>{selectedFile}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
        ) : (
          <>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
              Choose Video File
            </span>
            <span className="text-[11px] text-slate-500 mt-1 font-mono">MP4, AVI, MOV up to 500MB</span>
          </>
        )}
      </label>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            isAnalyzing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-[#0EA5E9] hover:bg-sky-400 text-white shadow-[0_0_12px_rgba(14,165,233,0.3)]'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Start Analysis'}</span>
        </button>

        <button
          onClick={handleStopAnalysis}
          disabled={!isAnalyzing}
          className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            !isAnalyzing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Stop Analysis</span>
        </button>

        <button
          onClick={handleReset}
          className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;
