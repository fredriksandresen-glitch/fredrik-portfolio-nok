import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef } from "react";
import { createActor } from "../backend";
import { usePortfolioStore } from "../store/usePortfolioStore";
import type {
  PortfolioSnapshot,
  PortfolioSummary,
  YieldInfo,
} from "../types/portfolio";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Background data fetcher. The UI is NEVER blocked on this.
 * Mock portfolio summary/prices are already in the store from initialization.
 * This hook fetches live data from the backend and updates the store.
 * Historical snapshots come ONLY from the real backend — no mock fallback.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  const store = usePortfolioStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAttemptedFetch = useRef(false);

  const fetchFromBackend = useCallback(async () => {
    if (!actor || isFetching) return;

    store.setError(null);

    try {
      // First: trigger live price refresh (HTTP outcalls to CoinGecko + Finnhub)
      // and record today's daily snapshot. Await it so prices are fresh before
      // we fetch the summary.
      try {
        await actor.refreshPrices();
      } catch {
        // Price refresh can fail (rate limit, network) — continue fetching
        // cached data from the backend regardless.
      }

      const [summary, snapshots, yieldInfo] = await Promise.all([
        actor.getPortfolioSummary() as Promise<PortfolioSummary>,
        actor.getHistoricalSnapshots() as Promise<PortfolioSnapshot[]>,
        actor.getYieldInfo() as Promise<YieldInfo[]>,
      ]);

      store.setSummary(summary);
      store.setYieldInfo(yieldInfo);
      store.markUpdated();

      const status = summary.hasLiveData ? "live" : "stale";
      store.setDataStatus(status);

      // Use ONLY real backend snapshots — empty array is valid (fresh start).
      // No mock history fallback for the chart.
      store.setHistoricalSnapshots(snapshots ?? []);
    } catch (_err) {
      // Backend fetch failed — keep existing mock summary/prices, update status
      store.setDataStatus("stale");
    }
  }, [actor, isFetching, store]);

  // Attempt backend fetch when actor becomes ready (runs in background)
  useEffect(() => {
    if (!actor || isFetching || hasAttemptedFetch.current) return;
    hasAttemptedFetch.current = true;
    fetchFromBackend();
  }, [actor, isFetching, fetchFromBackend]);

  // Periodic refresh every 5 minutes (includes refreshPrices each cycle)
  useEffect(() => {
    if (!actor || isFetching) return;

    intervalRef.current = setInterval(fetchFromBackend, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [actor, isFetching, fetchFromBackend]);

  const refresh = useCallback(async () => {
    if (actor && !isFetching) {
      await fetchFromBackend();
    }
  }, [actor, isFetching, fetchFromBackend]);

  return { refresh };
}
