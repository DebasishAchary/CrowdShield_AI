// CrowdShield AI Backend
//
// Android APK connects to the laptop running FastAPI
// over the same Wi-Fi network.

const BACKEND_URL = 'http://10.70.39.245:8000';

export const CONFIG = {
  API_BASE_URL: BACKEND_URL,

  AUTO_REFRESH_INTERVAL: 1000,

  ENDPOINTS: {
    ROOT: '/',
    STATUS: '/status',
    RISK: '/risk',
    FLOW: '/flow',
    ZONES: '/zones',
    RECOMMENDATIONS: '/recommendations',
    BOTTLENECK: '/bottleneck',
    VIDEO_FEED: '/video_feed',
    SET_SOURCE: '/set_source',
    UPLOAD_VIDEO: '/upload_video',
  },

  DEFAULT_THRESHOLDS: {
    MEDIUM_DENSITY: 20,
    HIGH_DENSITY: 40,
    AUTO_REFRESH_INTERVAL: 1000,
  },
};