import { useEffect, useState } from "react";

export function useLiveTicker(intervalMs = 6000) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return tick;
}

export function jitter(base: number, tick: number, seed: number, pct: number) {
  const wave = Math.sin((tick + 1) * (seed + 3.17) * 12.9898) * 43758.5453;
  const normalized = wave - Math.floor(wave);
  const signed = normalized * 2 - 1;

  return base * (1 + signed * pct);
}
