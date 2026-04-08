export enum AssetType {
  Stock = "Stock",
  Crypto = "Crypto",
}

export interface AssetHolding {
  name: string;
  yieldRate: number;
  stakedQty: number;
  quantity: number;
  assetType: AssetType;
  symbol: string;
}

export interface PriceData {
  isMockData: boolean;
  lastUpdated: bigint;
  isLive: boolean;
  priceNOK: number;
  priceUSD: number;
  symbol: string;
}

export interface AssetWithPrice {
  holding: AssetHolding;
  price?: PriceData;
  valueNOK: number;
}

export interface PortfolioSummary {
  totalValueNOK: number;
  assets: AssetWithPrice[];
  lastPriceUpdate?: bigint;
  hasLiveData: boolean;
  usdNokRate: number;
}

export interface PortfolioSnapshot {
  totalValueNOK: number;
  date: string;
  recordedAt: bigint;
  perAssetValues: [string, number][];
}

export interface YieldInfo {
  annualYieldRate: number;
  yearlyYieldNOK: number;
  monthlyYieldAsset: number;
  monthlyYieldNOK: number;
  yearlyYieldAsset: number;
  stakedQty: number;
  symbol: string;
}

export type DataStatus = "live" | "stale" | "error" | "loading";

export interface PortfolioState {
  summary: PortfolioSummary | null;
  historicalSnapshots: PortfolioSnapshot[];
  yieldInfo: YieldInfo[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  dataStatus: DataStatus;
}
