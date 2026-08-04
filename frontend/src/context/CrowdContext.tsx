import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CrowdStatusResponse, SystemSettings, TimelineDataPoint, RiskLevel } from '../types/crowd';
import { crowdService } from '../services/crowdService';
import { CONFIG } from '../config/config';

interface CrowdContextType {
  crowdData: CrowdStatusResponse;
  isConnected: boolean;
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  timelineHistory: TimelineDataPoint[];
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

const DEFAULT_CROWD_DATA: CrowdStatusResponse = {
  people: 48,
  risk: 'MEDIUM',
  highest_zone: 'Zone A',
  zones: {
    A: 18,
    B: 12,
    C: 10,
    D: 8,
  },
  flow: {
    UP: 14,
    DOWN: 10,
    LEFT: 12,
    RIGHT: 8,
    STATIONARY: 4,
  },
  recommendations: [
    'Open overflow corridor at Gate A to relieve 18% density surge',
    'Monitor bottleneck near Main Entrance Corridor',
  ],
  bottleneck: 'Detected in Zone A near Main Entrance',
};

const CrowdContext = createContext<CrowdContextType | undefined>(undefined);

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crowdData, setCrowdData] = useState<CrowdStatusResponse>(DEFAULT_CROWD_DATA);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [timelineHistory, setTimelineHistory] = useState<TimelineDataPoint[]>([]);

  const [settings, setSettings] = useState<SystemSettings>({
    mediumDensityThreshold: CONFIG.DEFAULT_THRESHOLDS.MEDIUM_DENSITY,
    highDensityThreshold: CONFIG.DEFAULT_THRESHOLDS.HIGH_DENSITY,
    autoRefreshInterval: CONFIG.DEFAULT_THRESHOLDS.AUTO_REFRESH_INTERVAL,
  });

  const simRef = useRef(DEFAULT_CROWD_DATA);

  // Generate realistic simulated tick if backend is offline and simulation is active
  const generateSimulatedTick = useCallback(() => {
    const prev = simRef.current;

    // Small random variations
    const deltaA = Math.floor(Math.random() * 5) - 2;
    const deltaB = Math.floor(Math.random() * 5) - 2;
    const deltaC = Math.floor(Math.random() * 5) - 2;
    const deltaD = Math.floor(Math.random() * 5) - 2;

    const newA = Math.max(5, Math.min(35, prev.zones.A + deltaA));
    const newB = Math.max(4, Math.min(30, prev.zones.B + deltaB));
    const newC = Math.max(3, Math.min(25, prev.zones.C + deltaC));
    const newD = Math.max(2, Math.min(20, prev.zones.D + deltaD));

    const totalPeople = newA + newB + newC + newD;

    // Determine highest zone
    const maxVal = Math.max(newA, newB, newC, newD);
    let highestZone = 'Zone A';
    if (maxVal === newB) highestZone = 'Zone B';
    else if (maxVal === newC) highestZone = 'Zone C';
    else if (maxVal === newD) highestZone = 'Zone D';

    // Calculate risk
    let risk: RiskLevel = 'LOW';
    if (totalPeople >= settings.highDensityThreshold) {
      risk = 'HIGH';
    } else if (totalPeople >= settings.mediumDensityThreshold) {
      risk = 'MEDIUM';
    }
    if (newA >= 25 || newB >= 25) {
      risk = 'CRITICAL';
    }

    const flowUp = Math.max(2, Math.floor(totalPeople * 0.3) + Math.floor(Math.random() * 3 - 1));
    const flowDown = Math.max(2, Math.floor(totalPeople * 0.25) + Math.floor(Math.random() * 3 - 1));
    const flowLeft = Math.max(2, Math.floor(totalPeople * 0.2) + Math.floor(Math.random() * 3 - 1));
    const flowRight = Math.max(2, Math.floor(totalPeople * 0.15) + Math.floor(Math.random() * 3 - 1));
    const flowStationary = Math.max(1, totalPeople - (flowUp + flowDown + flowLeft + flowRight));

    let bottleneck = 'No Bottleneck Detected';
    if (newA >= 22) {
      bottleneck = 'Detected in Zone A near Main Entrance';
    } else if (newB >= 20) {
      bottleneck = 'Detected in Zone B near Escalator North';
    } else if (newC >= 18) {
      bottleneck = 'Detected in Zone C near Security Gate 2';
    }

    const recs: string[] = [];
    if (risk === 'CRITICAL' || risk === 'HIGH') {
      recs.push(`Open auxiliary exit near ${highestZone} to relieve crowd build-up`);
      recs.push(`Dispatch crowd safety officer to ${highestZone}`);
    } else if (risk === 'MEDIUM') {
      recs.push(`Monitor traffic flow in ${highestZone}`);
      recs.push(`Maintain standard gate throughput velocity`);
    } else {
      recs.push('All zones operating within safe occupancy thresholds');
    }

    const updated: CrowdStatusResponse = {
      people: totalPeople,
      risk,
      highest_zone: highestZone,
      zones: { A: newA, B: newB, C: newC, D: newD },
      flow: {
        UP: flowUp,
        DOWN: flowDown,
        LEFT: flowLeft,
        RIGHT: flowRight,
        STATIONARY: Math.max(0, flowStationary),
      },
      recommendations: recs,
      bottleneck,
    };

    simRef.current = updated;
    return updated;
  }, [settings]);

  const recordTimelinePoint = useCallback((data: CrowdStatusResponse) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setTimelineHistory((prev) => {
      const newPoint: TimelineDataPoint = {
        timestamp: now.toISOString(),
        time: timeStr,
        people: data.people,
        risk: data.risk,
        zoneA: data.zones.A,
        zoneB: data.zones.B,
        zoneC: data.zones.C,
        zoneD: data.zones.D,
      };
      // Keep last 30 readings
      const updated = [...prev, newPoint];
      if (updated.length > 30) return updated.slice(updated.length - 30);
      return updated;
    });
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const data = await crowdService.getStatus();
      setCrowdData(data);
      setIsConnected(true);
      setLastUpdated(new Date());
      recordTimelinePoint(data);
    } catch {
      setIsConnected(false);
      if (isSimulationMode) {
        const simData = generateSimulatedTick();
        setCrowdData(simData);
        setLastUpdated(new Date());
        recordTimelinePoint(simData);
      }
    }
  }, [isSimulationMode, generateSimulatedTick, recordTimelinePoint]);

  // Initial and recurring auto-refresh loop (every 1000ms)
  useEffect(() => {
    refreshData();
    const intervalId = setInterval(() => {
      refreshData();
    }, settings.autoRefreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshData, settings.autoRefreshInterval]);

  const toggleSimulationMode = () => {
    setIsSimulationMode((prev) => !prev);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <CrowdContext.Provider
      value={{
        crowdData,
        isConnected,
        isSimulationMode,
        toggleSimulationMode,
        settings,
        updateSettings,
        timelineHistory,
        lastUpdated,
        refreshData,
      }}
    >
      {children}
    </CrowdContext.Provider>
  );
};

export const useCrowdContext = (): CrowdContextType => {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error('useCrowdContext must be used within a CrowdProvider');
  }
  return context;
};
