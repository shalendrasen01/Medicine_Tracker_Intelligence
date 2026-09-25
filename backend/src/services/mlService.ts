import { AppError } from "../middleware/errorHandler";

export interface ForecastInput {
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

export interface ForecastOutput {
  phc_id: string;
  medicine_id: string;
  predicted_demand: number;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
}

export interface StockoutInput {
  phc_id: string;
  medicine_id: string;
  current_stock: number;
  predicted_daily_demand: number;
}

export interface StockoutOutput {
  phc_id: string;
  medicine_id: string;
  days_remaining: number | null;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
}

export interface OptimizationSource {
  phc_id: string;
  medicine_id: string;
  surplus: number;
}

export interface OptimizationDestination {
  phc_id: string;
  medicine_id: string;
  required: number;
}

export interface OptimizationDistance {
  source_phc: string;
  destination_phc: string;
  distance_km: number;
}

export interface OptimizationInput {
  sources: OptimizationSource[];
  destinations: OptimizationDestination[];
  distances: OptimizationDistance[];
}

export interface RedistributionPlanItem {
  source_phc: string;
  destination_phc: string;
  quantity: number;
  distance_km: number;
}

export interface OptimizationOutput {
  redistribution_plan: RedistributionPlanItem[];
}

export class MLService {
  private static getBaseUrl(): string {
    return (process.env.ML_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  }

  private static async safeJsonParse(response: Response): Promise<unknown> {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      // Handle Python/FastAPI unquoted Infinity or NaN
      const sanitized = text
        .replace(/:\s*Infinity\b/g, ": null")
        .replace(/:\s*-Infinity\b/g, ": null")
        .replace(/:\s*NaN\b/g, ": null");
      return JSON.parse(sanitized);
    }
  }

  /**
   * Health check for ML Service
   */
  public static async checkHealth(): Promise<{ status: string; online: boolean; url: string }> {
    const url = `${this.getBaseUrl()}/health`;
    try {
      const response = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        return { status: `HTTP ${response.status}`, online: false, url };
      }

      const data = (await this.safeJsonParse(response)) as { status?: string };
      return { status: data.status || "ok", online: true, url };
    } catch {
      return { status: "unreachable", online: false, url };
    }
  }

  /**
   * Calls POST /predict/demand
   */
  public static async predictDemand(input: ForecastInput): Promise<ForecastOutput> {
    const url = `${this.getBaseUrl()}/predict/demand`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        const errorData = (await this.safeJsonParse(response)) as { detail?: unknown };
        const detailMsg = typeof errorData.detail === "string" 
          ? errorData.detail 
          : JSON.stringify(errorData.detail ?? "Demand prediction failed");
        
        if (response.status === 422) {
          throw new AppError(`ML Validation Error: ${detailMsg}`, 400);
        }
        throw new AppError(`ML Service Error (${response.status}): ${detailMsg}`, 502);
      }

      const result = (await this.safeJsonParse(response)) as ForecastOutput;
      return result;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new AppError("ML Service request timed out after 5000ms", 504);
      }
      throw new AppError(
        `ML Service is unavailable (${this.getBaseUrl()}). Please ensure the ML service is running.`,
        503
      );
    }
  }

  /**
   * Calls POST /predict/stockout
   */
  public static async predictStockout(input: StockoutInput): Promise<StockoutOutput> {
    const url = `${this.getBaseUrl()}/predict/stockout`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        const errorData = (await this.safeJsonParse(response)) as { detail?: unknown };
        const detailMsg = typeof errorData.detail === "string" 
          ? errorData.detail 
          : JSON.stringify(errorData.detail ?? "Stockout prediction failed");

        if (response.status === 422) {
          throw new AppError(`ML Validation Error: ${detailMsg}`, 400);
        }
        throw new AppError(`ML Service Error (${response.status}): ${detailMsg}`, 502);
      }

      const result = (await this.safeJsonParse(response)) as StockoutOutput;
      return result;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new AppError("ML Service request timed out after 5000ms", 504);
      }
      throw new AppError(
        `ML Service is unavailable (${this.getBaseUrl()}). Please ensure the ML service is running.`,
        503
      );
    }
  }

  /**
   * Calls POST /optimize
   */
  public static async optimizeRedistribution(input: OptimizationInput): Promise<OptimizationOutput> {
    const url = `${this.getBaseUrl()}/optimize`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = (await this.safeJsonParse(response)) as { detail?: unknown };
        const detailMsg = typeof errorData.detail === "string" 
          ? errorData.detail 
          : JSON.stringify(errorData.detail ?? "Optimization calculation failed");

        if (response.status === 422) {
          throw new AppError(`ML Validation Error: ${detailMsg}`, 400);
        }
        throw new AppError(`Optimization Error (${response.status}): ${detailMsg}`, 502);
      }

      const result = (await this.safeJsonParse(response)) as OptimizationOutput;
      return result;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new AppError("ML Service request timed out after 10000ms", 504);
      }
      throw new AppError(
        `ML Service is unavailable (${this.getBaseUrl()}). Please ensure the ML service is running.`,
        503
      );
    }
  }
}
