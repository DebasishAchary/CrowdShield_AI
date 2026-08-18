import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Maximize, Radio, Eye, WifiOff } from 'lucide-react';
import { useCrowdStatus } from '../../hooks/useCrowdStatus';
import { getRiskBadgeColor } from '../../utils/formatters';
import { CONFIG } from '../../config/config';

const VIDEO_FEED_URL = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VIDEO_FEED}`;

export const VideoPlayer: React.FC = () => {
  const { people, risk, highestZone, isConnected } = useCrowdStatus();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [frameCount, setFrameCount] = useState<number>(1420);
  const [imgError, setImgError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const riskStyle = getRiskBadgeColor(risk);

  useEffect(() => {
    if (!isPlaying || isStopped || (isConnected && !imgError)) return;
    const interval = setInterval(() => {
      setFrameCount((prev) => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, isStopped, isConnected, imgError]);

  useEffect(() => {
    if (isConnected) setImgError(false);
  }, [isConnected]);

  const togglePlay = () => {
    if (isStopped) {
      setIsStopped(false);
      setIsPlaying(true);
      setImgError(false);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsStopped(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const showLiveFeed = isConnected && !imgError && isPlaying && !isStopped;

  const renderSimulatedBoundingBoxes = () => {
    if (showLiveFeed || !isPlaying || isStopped) return null;
    const count = Math.min(12, Math.max(3, people));
    const boxes = [];

    for (let i = 0; i < count; i++) {
      const seedX = (i * 73 + frameCount * 3) % 85;
      const seedY = (i * 47 + frameCount * 2) % 65;
      const width = 8 + (i % 3);
      const height = 18 + (i % 4);

      boxes.push(
        <div
          key={i}
          className="absolute border border-[#0EA5E9] bg-[#0EA5E9]/10 rounded transition-all duration-300 pointer-events-none"
          style={{
            left: `${10 + seedX}%`,
            top: `${15 + seedY}%`,
            width: `${width}%`,
            height: `${height}%`,
          }}
        >
          <span className="absolute -top-3.5 left-0 bg-[#0EA5E9] text-slate-950 font-mono font-extrabold text-[8px] px-1 rounded-xs">
            ID:{101 + i} • 0.94
          </span>
        </div>
      );
    }

    return boxes;
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#1E293B] rounded-xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col justify-between relative group"
    >
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Radio className="w-3 h-3 animate-pulse" /> CAM-01 MAIN CONCOURSE
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            1920x1080 @ 30 FPS • YOLOv8 + ByteTrack
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}>
            {risk} RISK
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {showLiveFeed ? 'LIVE MJPEG' : `FRAME: #${frameCount}`}
          </span>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden select-none">
        {showLiveFeed && (
          <img
            ref={imgRef}
            src={`${VIDEO_FEED_URL}?t=${Date.now()}`}
            alt="Live surveillance feed"
            className="absolute inset-0 w-full h-full object-contain z-10"
            onError={() => setImgError(true)}
          />
        )}

        {!showLiveFeed && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#0EA5E9 1px, transparent 1px), radial-gradient(#0EA5E9 1px, #0F172A 1px)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          />
        )}

        {isStopped && (
          <div className="flex flex-col items-center gap-2 text-slate-500 z-20">
            <Square className="w-12 h-12 text-slate-600" />
            <span className="font-mono text-sm font-semibold">VIDEO STREAM STOPPED</span>
            <span className="text-xs text-slate-600">Click Play to Resume AI Feed</span>
          </div>
        )}

        {!isStopped && !showLiveFeed && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            <div className="absolute top-4 left-4 border-l-2 border-t-2 border-[#0EA5E9]/60 w-5 h-5" />
            <div className="absolute top-4 right-4 border-r-2 border-t-2 border-[#0EA5E9]/60 w-5 h-5" />
            <div className="absolute bottom-4 left-4 border-l-2 border-b-2 border-[#0EA5E9]/60 w-5 h-5" />
            <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-[#0EA5E9]/60 w-5 h-5" />

            {imgError && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded z-20">
                <WifiOff className="w-3 h-3" /> STREAM UNAVAILABLE
              </div>
            )}

            {renderSimulatedBoundingBoxes()}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-48 h-48 border border-cyan-500/40 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 border border-dashed border-cyan-400/50 rounded-full"></div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-xs font-mono flex items-center gap-2 text-slate-200 z-20">
              <Eye className="w-3.5 h-3.5 text-[#0EA5E9] animate-pulse" />
              <span>
                DETECTED: <strong className="text-white font-bold">{people} Persons</strong> ({highestZone})
              </span>
            </div>
          </>
        )}
      </div>

      <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-[#0EA5E9]/20 hover:bg-[#0EA5E9] text-[#0EA5E9] hover:text-white border border-[#0EA5E9]/40 transition-colors font-medium text-xs flex items-center gap-1.5"
            title={isPlaying ? 'Pause Stream' : 'Play Stream'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleStop}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors text-xs flex items-center gap-1.5"
            title="Stop Stream"
          >
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Status:{' '}
            <span className={`font-semibold ${isConnected && !imgError ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isConnected && !imgError ? 'LIVE BACKEND' : 'SIMULATED FEED'}
            </span>
          </span>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Fullscreen Mode"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
