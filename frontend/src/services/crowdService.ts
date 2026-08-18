import apiClient from '../api/axios';
import { CONFIG } from '../config/config';
import { CrowdStatusResponse, ZoneData, CrowdFlow, RiskLevel, BottleneckInfo } from '../types/crowd';

export const crowdService = {
  // Primary combined endpoint GET /status
  async getStatus(): Promise<CrowdStatusResponse> {
    const response = await apiClient.get<CrowdStatusResponse>(CONFIG.ENDPOINTS.STATUS);
    return response.data;
  },

  // Individual endpoint GET /risk
  async getRisk(): Promise<{ risk: RiskLevel }> {
    const response = await apiClient.get<{ risk: RiskLevel }>(CONFIG.ENDPOINTS.RISK);
    return response.data;
  },

  // Individual endpoint GET /flow
  async getFlow(): Promise<{ flow: CrowdFlow }> {
    const response = await apiClient.get<{ flow: CrowdFlow }>(CONFIG.ENDPOINTS.FLOW);
    return response.data;
  },

  // Individual endpoint GET /zones
  async getZones(): Promise<{ zones: ZoneData; highest_zone: string }> {
    const response = await apiClient.get<{ zones: ZoneData; highest_zone: string }>(CONFIG.ENDPOINTS.ZONES);
    return response.data;
  },

  // Individual endpoint GET /recommendations
  async getRecommendations(): Promise<{ recommendations: string[] }> {
    const response = await apiClient.get<{ recommendations: string[] }>(CONFIG.ENDPOINTS.RECOMMENDATIONS);
    return response.data;
  },

  // Individual endpoint GET /bottleneck — returns BottleneckInfo object from backend
  async getBottleneck(): Promise<BottleneckInfo> {
    const response = await apiClient.get<BottleneckInfo>(CONFIG.ENDPOINTS.BOTTLENECK);
    return response.data;
  },

  // Health / Root check GET /
  async getRoot(): Promise<{ message: string; status: string }> {
    const response = await apiClient.get(CONFIG.ENDPOINTS.ROOT);
    return response.data;
  },
};
