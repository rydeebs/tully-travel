import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "../components";

const LINES = [
  "Reading the brief closely",
  "Weighing distance and pace",
  "Choosing places to stay by feel",
  "Considering the moments only access allows",
  "Setting down a calm first draft",
];

type LoadingLinesProps = {
  reducedMotion: boolean;
};

export function LoadingLines({ reducedMotion }: LoadingLinesProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (reducedMotion) {
        setIndex((current) => (current + 1) % LINES.length);
        return;
      }

      setVisible(false);
      timerRef.current = window.setTimeout(() => {
        setIndex((current) => (current + 1) % LINES.length);
        setVisible(true);
      }, 260);
    }, 3500);

    return () => {
      window.clearInterval(interval);

      if (timerRef.current === null) {
        return;
      }

      window.clearTimeout(timerRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="app-loading" aria-live="polite">
      <Eyebrow>Composing your draft</Eyebrow>
      <p className={visible ? "app-loading__line app-loading__line--visible" : "app-loading__line"}>
        {LINES[index]}
      </p>
      <p className="app-loading__note">This usually takes under a minute.</p>
    </div>
  );
}
