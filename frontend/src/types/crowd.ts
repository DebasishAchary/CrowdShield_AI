export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ZoneData {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface CrowdFlow {
  UP: number;
  DOWN: number;
  LEFT: number;
  RIGHT: number;
  STATIONARY: number;
}

/**
 * Shape returned by GET /bottleneck on the FastAPI backend.
 */
export interface BottleneckInfo {
  bottleneck: boolean;
  zone: string | null;
  reason: string;
}

export interface CrowdStatusResponse {
  people: number;
  risk: RiskLevel;
  highest_zone: string;
  zones: ZoneData;
  flow: CrowdFlow;
  recommendations: string[];
  /** Can be an object (live backend) or a legacy string (simulation fallback) */
  bottleneck: BottleneckInfo | string;
}

export interface SystemSettings {
  highDensityThreshold: number;
  mediumDensityThreshold: number;
  autoRefreshInterval: number;
}

export interface TimelineDataPoint {
  timestamp: string;
  time: string;
  people: number;
  risk: RiskLevel;
  zoneA: number;
  zoneB: number;
  zoneC: number;
  zoneD: number;
}
