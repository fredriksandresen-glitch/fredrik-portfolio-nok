import { AssetType } from "../backend";
import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  addAsset: async () => undefined,
  deleteAsset: async () => true,
  getAsset: async () => null,
  getCurrentPrices: async () => [
    {
      symbol: "ICP",
      priceUSD: 8.42,
      priceNOK: 90.3,
      isLive: true,
      isMockData: true,
      lastUpdated: now,
    },
    {
      symbol: "BTC",
      priceUSD: 65200,
      priceNOK: 699000,
      isLive: true,
      isMockData: true,
      lastUpdated: now,
    },
    {
      symbol: "BMNR",
      priceUSD: 12.5,
      priceNOK: 134.1,
      isLive: true,
      isMockData: true,
      lastUpdated: now,
    },
    {
      symbol: "MSTR",
      priceUSD: 380,
      priceNOK: 4076,
      isLive: true,
      isMockData: true,
      lastUpdated: now,
    },
    {
      symbol: "SBET",
      priceUSD: 2.1,
      priceNOK: 22.5,
      isLive: true,
      isMockData: true,
      lastUpdated: now,
    },
  ],
  // History is built organically from real backend snapshots only.
  // The mock never generates fake history — an empty array is the correct
  // starting state for a brand-new portfolio.
  getHistoricalSnapshots: async () => [],
  getLastNSnapshots: async (_n) => [],
  getPortfolio: async () => [
    { symbol: "ICP", name: "Internet Computer", quantity: 17000, stakedQty: 9000, yieldRate: 7.7, assetType: AssetType.Crypto },
    { symbol: "BTC", name: "Bitcoin", quantity: 0.1, stakedQty: 0, yieldRate: 0, assetType: AssetType.Crypto },
    { symbol: "BMNR", name: "Bitmine Immersion Technologies", quantity: 700, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
    { symbol: "MSTR", name: "MicroStrategy", quantity: 9, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
    { symbol: "SBET", name: "SharpSports Bet", quantity: 653, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
  ],
  getPortfolioSummary: async () => ({
    totalValueNOK: 1_564_843,
    hasLiveData: true,
    usdNokRate: 10.73,
    lastPriceUpdate: now,
    assets: [
      {
        holding: { symbol: "ICP", name: "Internet Computer", quantity: 17000, stakedQty: 9000, yieldRate: 7.7, assetType: AssetType.Crypto },
        price: { symbol: "ICP", priceUSD: 8.42, priceNOK: 90.3, isLive: true, isMockData: true, lastUpdated: now },
        valueNOK: Math.round(17000 * 90.3),
      },
      {
        holding: { symbol: "BTC", name: "Bitcoin", quantity: 0.1, stakedQty: 0, yieldRate: 0, assetType: AssetType.Crypto },
        price: { symbol: "BTC", priceUSD: 65200, priceNOK: 699000, isLive: true, isMockData: true, lastUpdated: now },
        valueNOK: Math.round(0.1 * 699000),
      },
      {
        holding: { symbol: "BMNR", name: "Bitmine Immersion Technologies", quantity: 700, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
        price: { symbol: "BMNR", priceUSD: 12.5, priceNOK: 134.1, isLive: true, isMockData: true, lastUpdated: now },
        valueNOK: Math.round(700 * 134.1),
      },
      {
        holding: { symbol: "MSTR", name: "MicroStrategy", quantity: 9, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
        price: { symbol: "MSTR", priceUSD: 380, priceNOK: 4076, isLive: true, isMockData: true, lastUpdated: now },
        valueNOK: Math.round(9 * 4076),
      },
      {
        holding: { symbol: "SBET", name: "SharpSports Bet", quantity: 653, stakedQty: 0, yieldRate: 0, assetType: AssetType.Stock },
        price: { symbol: "SBET", priceUSD: 2.1, priceNOK: 22.5, isLive: true, isMockData: true, lastUpdated: now },
        valueNOK: Math.round(653 * 22.5),
      },
    ],
  }),
  getYieldInfo: async () => [
    {
      symbol: "ICP",
      stakedQty: 9000,
      annualYieldRate: 7.7,
      monthlyYieldAsset: (9000 * 0.077) / 12,
      yearlyYieldAsset: 9000 * 0.077,
      monthlyYieldNOK: Math.round((9000 * 0.077 / 12) * 90.3),
      yearlyYieldNOK: Math.round(9000 * 0.077 * 90.3),
    },
  ],
  clearAllSnapshots: async () => {},
  recordDailySnapshot: async () => true,
  refreshPrices: async () => "Priser oppdatert",
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
  updateAsset: async () => true,
};
