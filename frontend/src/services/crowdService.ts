import apiClient from '../api/axios';
import { CONFIG } from '../config/config';
import {
  CrowdStatusResponse,
  ZoneData,
  CrowdFlow,
  RiskLevel,
  BottleneckInfo,
} from '../types/crowd';

export const crowdService = {
  async getStatus(): Promise<CrowdStatusResponse> {
    const response = await apiClient.get<CrowdStatusResponse>(
      CONFIG.ENDPOINTS.STATUS
    );
    return response.data;
  },

  async getRisk(): Promise<{ risk: RiskLevel }> {
    const response = await apiClient.get<{ risk: RiskLevel }>(
      CONFIG.ENDPOINTS.RISK
    );
    return response.data;
  },

  async getFlow(): Promise<{ flow: CrowdFlow }> {
    const response = await apiClient.get<{ flow: CrowdFlow }>(
      CONFIG.ENDPOINTS.FLOW
    );
    return response.data;
  },

  async getZones(): Promise<{ zones: ZoneData; highest_zone: string }> {
    const response = await apiClient.get<{
      zones: ZoneData;
      highest_zone: string;
    }>(CONFIG.ENDPOINTS.ZONES);
    return response.data;
  },

  async getRecommendations(): Promise<{ recommendations: string[] }> {
    const response = await apiClient.get<{ recommendations: string[] }>(
      CONFIG.ENDPOINTS.RECOMMENDATIONS
    );
    return response.data;
  },

  async getBottleneck(): Promise<BottleneckInfo> {
    const response = await apiClient.get<BottleneckInfo>(
      CONFIG.ENDPOINTS.BOTTLENECK
    );
    return response.data;
  },

  async getRoot(): Promise<{ message: string; status: string }> {
    const response = await apiClient.get(CONFIG.ENDPOINTS.ROOT);
    return response.data;
  },

  /**
   * Switch the backend tracker to a camera, network stream, or local path.
   * Example source: "0", "rtsp://...", "http://...", "/path/video.mp4"
   */
  async setVideoSource(source: string): Promise<{
    message: string;
    source: string;
  }> {
    const response = await apiClient.post<{
      message: string;
      source: string;
    }>(CONFIG.ENDPOINTS.SET_SOURCE, { source });

    return response.data;
  },

  /**
   * Upload a video file and restart the backend tracker using the saved file.
   */
  async uploadVideoFile(file: File): Promise<{
    message: string;
    source: string;
    filename: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{
      message: string;
      source: string;
      filename: string;
    }>(CONFIG.ENDPOINTS.UPLOAD_VIDEO, formData);

    return response.data;
  },
};
