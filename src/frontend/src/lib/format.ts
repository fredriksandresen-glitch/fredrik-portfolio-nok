/**
 * Format a number as Norwegian Krone (NOK)
 */
export function formatNOK(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)} MNOK`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k NOK`;
    }
  }
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage with sign
 */
export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format asset quantity with appropriate decimals based on symbol
 */
export function formatQty(value: number, symbol: string): string {
  const cryptoSymbols = ["BTC", "ICP", "ETH"];
  const isCrypto = cryptoSymbols.includes(symbol.toUpperCase());

  if (isCrypto) {
    return `${value.toFixed(4)} ${symbol}`;
  }
  return `${value.toFixed(0)} stk`;
}

/**
 * Format a Date or timestamp (bigint nanoseconds) to Norwegian date string
 */
export function formatDate(date: Date | bigint | string): string {
  let d: Date;

  if (typeof date === "bigint") {
    // Convert nanoseconds to milliseconds
    d = new Date(Number(date / BigInt(1_000_000)));
  } else if (typeof date === "string") {
    d = new Date(date);
  } else {
    d = date;
  }

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time as relative (e.g. "3 min siden")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return "Aldri";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 60) return "Akkurat nå";
  if (diffMin < 60) return `${diffMin} min siden`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}t siden`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d siden`;
}
