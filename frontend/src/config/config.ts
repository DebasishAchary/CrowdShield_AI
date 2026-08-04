export const CONFIG = {
  API_BASE_URL: 'http://127.0.0.1:8000',
  AUTO_REFRESH_INTERVAL: 1000, // 1000 ms
  ENDPOINTS: {
    ROOT: '/',
    STATUS: '/status',
    RISK: '/risk',
    FLOW: '/flow',
    ZONES: '/zones',
    RECOMMENDATIONS: '/recommendations',
    BOTTLENECK: '/bottleneck',
  },
  DEFAULT_THRESHOLDS: {
    MEDIUM_DENSITY: 20,
    HIGH_DENSITY: 40,
    AUTO_REFRESH_INTERVAL: 1000,
  },
};
