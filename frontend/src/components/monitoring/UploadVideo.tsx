import React, { useRef, useState } from 'react';
import PhoneCamera from './PhoneCamera';

import {
  Upload,
  Camera,
  Radio,
  FileVideo,
  CheckCircle,
  Loader2,
  RotateCcw,
  Link as LinkIcon,
} from 'lucide-react';

import toast from 'react-hot-toast';
import { crowdService } from '../../services/crowdService';

type SourceTab = 'phone' | 'camera' | 'network' | 'file';

const toastStyle = {
  background: '#1E293B',
  color: '#fff',
  border: '1px solid #334155',
};

export const UploadVideo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SourceTab>('camera');
  const [networkUrl, setNetworkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        ...toastStyle,
        border: '1px solid #EF4444',
      },
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        ...toastStyle,
        border: '1px solid #10B981',
      },
    });
  };

  // =====================================================
  // Local Laptop Camera
  // =====================================================

  const handleCameraConnect = async () => {
    setIsConnecting(true);

    try {
      const response = await crowdService.setVideoSource('0');

      setActiveSource('0');

      showSuccess(
        response.message || 'Local camera connected.'
      );
    } catch (error: any) {
      showError(
        error?.response?.data?.detail ||
          'Unable to connect to the local camera.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // =====================================================
  // Network Camera
  // =====================================================

  const handleNetworkConnect = async () => {
    const source = networkUrl.trim();

    if (!source) {
      showError('Please enter an RTSP or HTTP stream URL.');
      return;
    }

    if (
      !source.startsWith('rtsp://') &&
      !source.startsWith('http://') &&
      !source.startsWith('https://')
    ) {
      showError(
        'Use a valid RTSP, HTTP, or HTTPS stream URL.'
      );
      return;
    }

    setIsConnecting(true);

    try {
      const response =
        await crowdService.setVideoSource(source);

      setActiveSource(source);

      showSuccess(
        response.message ||
          'Network stream connected.'
      );
    } catch (error: any) {
      showError(
        error?.response?.data?.detail ||
          'Unable to connect to the network stream.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // =====================================================
  // File Selection
  // =====================================================

  const handleFileChoose = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 500 * 1024 * 1024;

    if (!file.type.startsWith('video/')) {
      showError('Please select a valid video file.');
      return;
    }

    if (file.size > maxSize) {
      showError(
        'Video file must be 500MB or smaller.'
      );
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // File Upload
  // =====================================================

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showError(
        'Please choose a video file first.'
      );
      return;
    }

    setIsConnecting(true);

    try {
      const response =
        await crowdService.uploadVideoFile(
          selectedFile
        );

      setActiveSource(response.source);

      showSuccess(
        `Uploaded ${response.filename} and started AI analysis.`
      );
    } catch (error: any) {
      showError(
        error?.response?.data?.detail ||
          'Video upload failed.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // =====================================================
  // Reset
  // =====================================================

  const handleReset = () => {
    setSelectedFile(null);
    setNetworkUrl('');
    setActiveSource(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast(
      'Video source configuration reset.',
      {
        icon: '🔄',
        style: toastStyle,
      }
    );
  };

  // =====================================================
  // Source Tabs
  // =====================================================

  const tabs = [
    {
      id: 'phone' as const,
      label: 'Phone Camera',
      icon: Camera,
    },
    {
      id: 'camera' as const,
      label: 'Local Camera',
      icon: Camera,
    },
    {
      id: 'network' as const,
      label: 'Network Stream',
      icon: Radio,
    },
    {
      id: 'file' as const,
      label: 'File Upload',
      icon: FileVideo,
    },
  ];

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4">

      {/* =================================================
          Header
      ================================================= */}

      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 gap-3">

        <div>
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Video Source Configuration
          </h3>

          <p className="text-xs text-slate-400">
            Select a phone camera, local camera,
            network stream, or recorded video.
          </p>
        </div>

        {activeSource && (
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            SOURCE ACTIVE
          </span>
        )}
      </div>

      {/* =================================================
          Source Tabs
      ================================================= */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-lg bg-slate-900/70 p-1 border border-slate-700">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          const isActive =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`px-2 py-2 rounded-md text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#0EA5E9] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />

              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================
          PHONE CAMERA
      ================================================= */}

      {activeTab === 'phone' && (
        <PhoneCamera />
      )}

      {/* =================================================
          LOCAL LAPTOP CAMERA
      ================================================= */}

      {activeTab === 'camera' && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">

          <div className="flex items-center gap-3 mb-3">

            <div className="p-3 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9]">
              <Camera className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                Local Camera
              </h4>

              <p className="text-xs text-slate-500">
                Use the server machine's default
                webcam (camera 0).
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleCameraConnect}
            disabled={isConnecting}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0EA5E9] hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
          >

            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}

            {isConnecting
              ? 'Connecting...'
              : 'Connect Local Camera'}

          </button>

        </div>
      )}

      {/* =================================================
          NETWORK STREAM
      ================================================= */}

      {activeTab === 'network' && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">

          <div className="flex items-center gap-3 mb-3">

            <div className="p-3 rounded-full bg-violet-500/10 text-violet-400">
              <Radio className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                Network Stream
              </h4>

              <p className="text-xs text-slate-500">
                Connect an RTSP, HTTP, or HTTPS
                IP-camera/CCTV stream.
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-2">

            <div className="relative flex-1">

              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

              <input
                type="text"
                value={networkUrl}
                onChange={(e) =>
                  setNetworkUrl(e.target.value)
                }
                placeholder="rtsp://192.168.1.100:554/stream"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-[#0EA5E9] focus:outline-none text-xs font-mono text-white placeholder:text-slate-600"
              />

            </div>

            <button
              type="button"
              onClick={handleNetworkConnect}
              disabled={isConnecting}
              className="px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            >

              {isConnecting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              {isConnecting
                ? 'Connecting...'
                : 'Connect'}

            </button>

          </div>

          <p className="mt-2 text-[10px] text-slate-500 font-mono">
            Example: rtsp://camera-address/stream
            or http://camera-address:port/video
          </p>

        </div>
      )}

      {/* =================================================
          FILE UPLOAD
      ================================================= */}

      {activeTab === 'file' && (
        <div className="space-y-3">

          <label className="border-2 border-dashed border-slate-700 hover:border-[#0EA5E9]/60 bg-slate-900/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChoose}
              className="hidden"
            />

            <div className="p-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-[#0EA5E9] group-hover:bg-[#0EA5E9]/10 transition-colors mb-2">
              <Upload className="w-6 h-6" />
            </div>

            {selectedFile ? (
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold text-center">

                <FileVideo className="w-4 h-4 shrink-0" />

                <span className="truncate max-w-[220px]">
                  {selectedFile.name}
                </span>

                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />

              </div>
            ) : (
              <>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  Choose Video File
                </span>

                <span className="text-[11px] text-slate-500 mt-1 font-mono">
                  MP4, AVI, MOV, MKV up to 500MB
                </span>
              </>
            )}

          </label>

          <button
            type="button"
            onClick={handleFileUpload}
            disabled={!selectedFile || isConnecting}
            className={`w-full px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
              !selectedFile || isConnecting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-[#0EA5E9] hover:bg-sky-400 text-white shadow-[0_0_12px_rgba(14,165,233,0.3)]'
            }`}
          >

            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}

            {isConnecting
              ? 'Uploading & Starting...'
              : 'Upload & Start Analysis'}

          </button>

        </div>
      )}

      {/* =================================================
          RESET
      ================================================= */}

      <div className="pt-1 border-t border-slate-700/60">

        <button
          type="button"
          onClick={handleReset}
          disabled={isConnecting}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
        >

          <RotateCcw className="w-3.5 h-3.5" />

          Reset Source Configuration

        </button>

      </div>

    </div>
  );
};

export default UploadVideo;