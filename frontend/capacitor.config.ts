import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crowdshield.ai',
  appName: 'CrowdShield AI',
  webDir: 'dist',

  server: {
    androidScheme: 'http'
  }
};

export default config;