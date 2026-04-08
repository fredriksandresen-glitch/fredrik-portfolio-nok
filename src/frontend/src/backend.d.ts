import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceData {
    isMockData: boolean;
    lastUpdated: Time;
    isLive: boolean;
    priceNOK: number;
    priceUSD: number;
    symbol: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export type Time = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PortfolioSummary {
    totalValueNOK: number;
    assets: Array<AssetWithPrice>;
    lastPriceUpdate?: Time;
    hasLiveData: boolean;
    usdNokRate: number;
}
export interface PortfolioSnapshot {
    totalValueNOK: number;
    date: string;
    recordedAt: Time;
    perAssetValues: Array<[string, number]>;
}
export interface AssetWithPrice {
    holding: AssetHolding;
    price?: PriceData;
    valueNOK: number;
}
export interface AssetHolding {
    name: string;
    yieldRate: number;
    stakedQty: number;
    quantity: number;
    assetType: AssetType;
    symbol: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum AssetType {
    Stock = "Stock",
    Crypto = "Crypto"
}
export interface backendInterface {
    addAsset(holding: AssetHolding): Promise<void>;
    clearAllSnapshots(): Promise<void>;
    deleteAsset(symbol: string): Promise<boolean>;
    getAsset(symbol: string): Promise<AssetHolding | null>;
    getCurrentPrices(): Promise<Array<PriceData>>;
    getHistoricalSnapshots(): Promise<Array<PortfolioSnapshot>>;
    getLastNSnapshots(n: bigint): Promise<Array<PortfolioSnapshot>>;
    getPortfolio(): Promise<Array<AssetHolding>>;
    getPortfolioSummary(): Promise<PortfolioSummary>;
    getYieldInfo(): Promise<Array<YieldInfo>>;
    recordDailySnapshot(): Promise<boolean>;
    refreshPrices(): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAsset(holding: AssetHolding): Promise<boolean>;
}
