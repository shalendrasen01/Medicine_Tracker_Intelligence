import { apiClient } from './client';

export interface DemandForecastPayload {
  phc_id: string;
  medicine_id: string;
  stock: number;
  patient_footfall: number;
  temperature: number;
  disease_cases: number;
  day_of_week: number;
  month: number;
  lag_1: number;
  lag_7: number;
  rolling_mean_7: number;
}

export interface DemandForecastResult {
  phc_id: string;
  medicine_id: string;
  predicted_demand: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
}

export interface StockoutPredictionPayload {
  phc_id: string;
  medicine_id: string;
  current_stock: number;
  predicted_daily_demand: number;
}

export interface StockoutPredictionResult {
  phc_id: string;
  medicine_id: string;
  days_remaining: number | null;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
}

export interface OptimizationSourceItem {
  phc_id: string;
  medicine_id: string;
  surplus: number;
}

export interface OptimizationDestinationItem {
  phc_id: string;
  medicine_id: string;
  required: number;
}

export interface OptimizationDistanceItem {
  source_phc: string;
  destination_phc: string;
  distance_km: number;
}

export interface OptimizationPayload {
  sources: OptimizationSourceItem[];
  destinations: OptimizationDestinationItem[];
  distances: OptimizationDistanceItem[];
}

export interface OptimizationPlanItem {
  source_phc: string;
  destination_phc: string;
  quantity: number;
  distance_km: number;
}

export interface OptimizationResult {
  redistribution_plan: OptimizationPlanItem[];
}

export interface PhcPredictionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  predictedDailyDemand: number;
  daysRemaining: number | null;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PhcPredictionsResult {
  phcId: string;
  count: number;
  items: PhcPredictionItem[];
}

export const getPredictionsHealth = async (): Promise<{ status: string; online: boolean; url: string }> => {
  return apiClient.get('/api/predictions/health');
};

export const predictDemand = async (payload: DemandForecastPayload): Promise<DemandForecastResult> => {
  return apiClient.post('/api/predictions/demand', payload);
};

export const predictStockout = async (payload: StockoutPredictionPayload): Promise<StockoutPredictionResult> => {
  return apiClient.post('/api/predictions/stockout', payload);
};

export const optimizeRedistribution = async (payload: OptimizationPayload): Promise<OptimizationResult> => {
  return apiClient.post('/api/predictions/optimize', payload);
};

export const getPhcPredictions = async (phcId: string): Promise<PhcPredictionsResult> => {
  return apiClient.get(`/api/predictions/phc/${phcId}`);
};
