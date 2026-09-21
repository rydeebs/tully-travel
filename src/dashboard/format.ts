type MoneyOptions = {
  compact?: boolean;
};

function trimDecimals(value: number, digits: number) {
  const fixed = value.toFixed(digits);
  // Only trim zeros after a decimal point; "90" must stay "90".
  return fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
}

export function money(value: number, options: MoneyOptions = {}) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);

  if (options.compact && absolute >= 1_000_000) {
    return `${sign}$${trimDecimals(absolute / 1_000_000, 2)}M`;
  }

  if (options.compact && absolute >= 1_000) {
    return `${sign}$${trimDecimals(absolute / 1_000, 1)}K`;
  }

  return `${sign}$${Math.round(absolute).toLocaleString("en-US")}`;
}

export function pct(value: number, digits = 1) {
  return `${trimDecimals(value * 100, digits)}%`;
}

export function num(value: number) {
  return Math.round(value).toLocaleString("en-US");
}
