import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Camera,
  CameraOff,
  Loader2,
} from 'lucide-react';

import toast from 'react-hot-toast';


// =====================================================
// FASTAPI BACKEND
// =====================================================

const BACKEND_URL =
  'http://10.70.39.245:8000';

const PHONE_FRAME_URL =
  `${BACKEND_URL}/phone_frame`;


// =====================================================
// COMPONENT
// =====================================================

const PhoneCamera: React.FC = () => {

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const intervalRef =
    useRef<number | null>(null);

  const sendingRef =
    useRef(false);


  const [cameraActive, setCameraActive] =
    useState(false);

  const [backendConnected, setBackendConnected] =
    useState(false);

  const [sending, setSending] =
    useState(false);


  // =====================================================
  // TEST BACKEND
  // =====================================================

  const checkBackend = async () => {

    try {

      const response =
        await fetch(
          `${BACKEND_URL}/`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        '✅ Backend response:',
        data
      );

      setBackendConnected(true);

      return true;

    } catch (error) {

      console.error(
        '❌ Backend connection failed:',
        error
      );

      setBackendConnected(false);

      return false;
    }
  };


  // =====================================================
  // START CAMERA
  // =====================================================

  const startCamera = async () => {

    try {

      console.log(
        '🔌 Checking FastAPI backend...'
      );

      const backendOK =
        await checkBackend();

      if (!backendOK) {

        toast.error(
          'FastAPI backend is unreachable'
        );

        return;
      }


      console.log(
        '📱 Requesting phone camera permission...'
      );


      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: 'environment',
              },

              width: {
                ideal: 1280,
              },

              height: {
                ideal: 720,
              },
            },

            audio: false,
          }
        );


      streamRef.current =
        stream;


      if (videoRef.current) {

        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }


      setCameraActive(true);


      toast.success(
        'Phone camera started'
      );


      console.log(
        '✅ Phone camera started'
      );

    } catch (error) {

      console.error(
        '❌ Camera startup error:',
        error
      );


      stopCamera();


      toast.error(
        'Unable to access phone camera'
      );
    }
  };


  // =====================================================
  // SEND FRAME TO BACKEND
  // =====================================================

  const sendFrame = async () => {

    if (sendingRef.current) {
      return;
    }


    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;


    if (!video || !canvas) {
      return;
    }


    if (video.readyState < 2) {
      return;
    }


    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return;
    }


    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;


    const context =
      canvas.getContext('2d');


    if (!context) {
      return;
    }


    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );


    canvas.toBlob(
      async (blob) => {

        if (!blob) {
          return;
        }


        sendingRef.current = true;

        setSending(true);


        try {

          const formData =
            new FormData();


          formData.append(
            'file',
            blob,
            'phone-frame.jpg'
          );


          const response =
            await fetch(
              PHONE_FRAME_URL,
              {
                method: 'POST',
                body: formData,
              }
            );


          if (!response.ok) {

            throw new Error(
              `HTTP ${response.status}`
            );
          }


          const result =
            await response.json();


          console.log(
            '📤 Phone frame sent:',
            result
          );


          setBackendConnected(
            true
          );

        } catch (error) {

          console.error(
            '❌ Phone frame upload failed:',
            error
          );


          setBackendConnected(
            false
          );

        } finally {

          sendingRef.current =
            false;

          setSending(false);
        }

      },

      'image/jpeg',

      0.70
    );
  };


  // =====================================================
  // FRAME LOOP
  // =====================================================

  useEffect(() => {

    if (!cameraActive) {
      return;
    }


    console.log(
      '▶️ Starting phone frame transmission'
    );


    intervalRef.current =
      window.setInterval(
        sendFrame,
        500
      );


    return () => {

      if (
        intervalRef.current !== null
      ) {

        window.clearInterval(
          intervalRef.current
        );

        intervalRef.current =
          null;
      }

    };

  }, [cameraActive]);


  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopCamera = () => {

    console.log(
      '⏹ Stopping phone camera'
    );


    if (
      intervalRef.current !== null
    ) {

      window.clearInterval(
        intervalRef.current
      );

      intervalRef.current =
        null;
    }


    streamRef.current
      ?.getTracks()
      .forEach(
        (track) => {
          track.stop();
        }
      );


    streamRef.current =
      null;


    if (videoRef.current) {

      videoRef.current.srcObject =
        null;
    }


    setCameraActive(false);

    setBackendConnected(false);

    setSending(false);

    sendingRef.current = false;
  };


  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {

    return () => {

      stopCamera();

    };

  }, []);


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 space-y-4">

      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">

          <Camera className="w-6 h-6" />

        </div>


        <div>

          <h4 className="text-sm font-bold text-white">
            Phone Camera
          </h4>

          <p className="text-xs text-slate-500">
            Use this phone's rear camera
            for crowd monitoring.
          </p>

        </div>

      </div>


      {/* Backend status */}

      <div
        className={
          `rounded-lg px-3 py-2 text-xs font-mono border ${
            backendConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`
        }
      >

        {backendConnected
          ? '● AI BACKEND CONNECTED'
          : '○ AI BACKEND DISCONNECTED'}

      </div>


      {/* Camera preview */}

      <div className="relative overflow-hidden rounded-xl bg-black aspect-video">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />


        {!cameraActive && (

          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">

            <CameraOff className="w-10 h-10 mb-2" />

            <span className="text-xs font-mono">
              Phone camera inactive
            </span>

          </div>

        )}


        {sending && (

          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-lg text-[10px] text-emerald-400 font-mono">

            <Loader2 className="w-3 h-3 animate-spin" />

            SENDING

          </div>

        )}

      </div>


      {/* Hidden canvas */}

      <canvas
        ref={canvasRef}
        className="hidden"
      />


      {/* Buttons */}

      {!cameraActive ? (

        <button
          type="button"
          onClick={startCamera}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-mono font-bold flex items-center justify-center gap-2"
        >

          <Camera className="w-4 h-4" />

          Start Phone Camera

        </button>

      ) : (

        <button
          type="button"
          onClick={stopCamera}
          className="w-full px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-bold flex items-center justify-center gap-2"
        >

          <CameraOff className="w-4 h-4" />

          Stop Phone Camera

        </button>

      )}

    </div>
  );
};


export default PhoneCamera;