// ─── Dynamic Backend URL ──────────────────────────────────────────────────────
// When opened from a network device, window.location.hostname is the server's
// LAN IP, so API calls automatically target that server on port 8000.
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_HOST =
  typeof window !== 'undefined'
    ? window.location.hostname
    : '127.0.0.1';

const BACKEND_URL = `http://${BACKEND_HOST}:8000`;

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
