import { create } from "zustand";
import type {
  DataStatus,
  PortfolioSnapshot,
  PortfolioSummary,
  YieldInfo,
} from "../types/portfolio";
import { AssetType } from "../types/portfolio";

// ── Mock data constants ────────────────────────────────────────────────────────
// Realistic mock prices (NOK): ICP ~120, BTC ~1,000,000, BMNR ~8, MSTR ~4000, SBET ~5
// Used as fallback for portfolio summary/prices only — never for history.
const USD_NOK = 10.5;

const MOCK_SUMMARY: PortfolioSummary = {
  totalValueNOK:
    17000 * 120 + // ICP
    0.1 * 1_000_000 + // BTC
    700 * 8 + // BMNR
    9 * 4000 + // MSTR
    653 * 5, // SBET
  usdNokRate: USD_NOK,
  hasLiveData: false,
  assets: [
    {
      holding: {
        symbol: "ICP",
        name: "Internet Computer",
        quantity: 17000,
        stakedQty: 9000,
        assetType: AssetType.Crypto,
        yieldRate: 0.077,
      },
      price: {
        symbol: "ICP",
        priceNOK: 120,
        priceUSD: 120 / USD_NOK,
        isLive: false,
        isMockData: true,
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      },
      valueNOK: 17000 * 120,
    },
    {
      holding: {
        symbol: "BTC",
        name: "Bitcoin",
        quantity: 0.1,
        stakedQty: 0,
        assetType: AssetType.Crypto,
        yieldRate: 0,
      },
      price: {
        symbol: "BTC",
        priceNOK: 1_000_000,
        priceUSD: 1_000_000 / USD_NOK,
        isLive: false,
        isMockData: true,
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      },
      valueNOK: 0.1 * 1_000_000,
    },
    {
      holding: {
        symbol: "BMNR",
        name: "Bitmine Corp",
        quantity: 700,
        stakedQty: 0,
        assetType: AssetType.Stock,
        yieldRate: 0,
      },
      price: {
        symbol: "BMNR",
        priceNOK: 8,
        priceUSD: 8 / USD_NOK,
        isLive: false,
        isMockData: true,
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      },
      valueNOK: 700 * 8,
    },
    {
      holding: {
        symbol: "MSTR",
        name: "MicroStrategy",
        quantity: 9,
        stakedQty: 0,
        assetType: AssetType.Stock,
        yieldRate: 0,
      },
      price: {
        symbol: "MSTR",
        priceNOK: 4000,
        priceUSD: 4000 / USD_NOK,
        isLive: false,
        isMockData: true,
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      },
      valueNOK: 9 * 4000,
    },
    {
      holding: {
        symbol: "SBET",
        name: "SharpLink Gaming",
        quantity: 653,
        stakedQty: 0,
        assetType: AssetType.Stock,
        yieldRate: 0,
      },
      price: {
        symbol: "SBET",
        priceNOK: 5,
        priceUSD: 5 / USD_NOK,
        isLive: false,
        isMockData: true,
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      },
      valueNOK: 653 * 5,
    },
  ],
};

// Staked ICP: 9000 @ 7.7% annual
const ICP_PRICE_NOK = 120;
const MOCK_YIELD: YieldInfo[] = [
  {
    symbol: "ICP",
    stakedQty: 9000,
    annualYieldRate: 0.077,
    yearlyYieldAsset: 9000 * 0.077,
    monthlyYieldAsset: (9000 * 0.077) / 12,
    yearlyYieldNOK: 9000 * 0.077 * ICP_PRICE_NOK,
    monthlyYieldNOK: (9000 * 0.077 * ICP_PRICE_NOK) / 12,
  },
];

// ── Store interface ────────────────────────────────────────────────────────────

interface PortfolioStore {
  summary: PortfolioSummary | null;
  historicalSnapshots: PortfolioSnapshot[];
  yieldInfo: YieldInfo[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  dataStatus: DataStatus;

  setSummary: (summary: PortfolioSummary) => void;
  setHistoricalSnapshots: (snapshots: PortfolioSnapshot[]) => void;
  setYieldInfo: (info: YieldInfo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDataStatus: (status: DataStatus) => void;
  markUpdated: () => void;
}

// Initialize with mock summary/prices — no historical snapshots (starts empty).
// The chart will show an informational state until real backend data arrives.
export const usePortfolioStore = create<PortfolioStore>((set) => ({
  summary: MOCK_SUMMARY,
  historicalSnapshots: [], // starts empty — real snapshots come from backend only
  yieldInfo: MOCK_YIELD,
  lastUpdated: null,
  isLoading: false,
  error: null,
  dataStatus: "stale",

  setSummary: (summary) => set({ summary }),
  setHistoricalSnapshots: (historicalSnapshots) => set({ historicalSnapshots }),
  setYieldInfo: (yieldInfo) => set({ yieldInfo }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDataStatus: (dataStatus) => set({ dataStatus }),
  markUpdated: () => set({ lastUpdated: new Date() }),
}));
