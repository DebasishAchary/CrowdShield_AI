import { useCrowdContext } from '../context/CrowdContext';

export const useCrowdStatus = () => {
  const context = useCrowdContext();
  return {
    people: context.crowdData.people,
    risk: context.crowdData.risk,
    highestZone: context.crowdData.highest_zone,
    zones: context.crowdData.zones,
    flow: context.crowdData.flow,
    recommendations: context.crowdData.recommendations,
    bottleneck: context.crowdData.bottleneck,
    isConnected: context.isConnected,
    isSimulationMode: context.isSimulationMode,
    toggleSimulationMode: context.toggleSimulationMode,
    settings: context.settings,
    updateSettings: context.updateSettings,
    timelineHistory: context.timelineHistory,
    lastUpdated: context.lastUpdated,
    refreshData: context.refreshData,
    raw: context.crowdData,
  };
};

export default useCrowdStatus;
