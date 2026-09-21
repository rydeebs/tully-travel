import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type Tone = "ink" | "gold";

type SparklineProps = {
  highlightLast?: boolean;
  values: number[];
};

type LineSeries = {
  dashed?: boolean;
  name: string;
  tone: Tone;
  values: Array<number | null>;
};

type LineChartProps = {
  format: (n: number) => string;
  height?: number;
  labels: string[];
  series: LineSeries[];
};

type BarChartProps = {
  format: (n: number) => string;
  items: Array<{
    highlight?: boolean;
    label: string;
    note?: string;
    value: number;
  }>;
  max?: number;
};

type FunnelProps = {
  stages: Array<{
    count: number;
    label: string;
    value?: string;
  }>;
};

type MeterProps = {
  caption?: string;
  label?: string;
  target?: number;
  value: number;
};

type ColumnChartProps = {
  format: (n: number) => string;
  highlightIndex?: number;
  labels: string[];
  values: number[];
};

const CHART_WIDTH = 680;
const CHART_LEFT = 68;
const CHART_RIGHT = 48;
const CHART_TOP = 20;
const CHART_BOTTOM = 38;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function range(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return { min: Math.min(0, min), max: max + 1 };
  }

  return { min, max };
}

// Measures the chart's rendered width so the SVG viewBox maps 1:1 to CSS pixels and
// text inside it renders at its stylesheet size instead of scaling with the container.
function useMeasuredWidth<T extends Element>(fallback = CHART_WIDTH) {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const node = ref.current;

    if (node === null || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const next = Math.round(entries[0]?.contentRect.width ?? 0);

      if (next > 0) {
        setWidth(next);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

// Clean axis steps: 1, 2, 2.5 or 5 times a power of ten.
function niceStep(raw: number) {
  if (raw <= 0) {
    return 1;
  }

  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const scaled = raw / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

function pointX(index: number, count: number, left: number, plotWidth: number) {
  if (count <= 1) {
    return left + plotWidth / 2;
  }

  return left + (plotWidth * index) / (count - 1);
}

function roundedRightBarPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  const end = x + width;

  return [
    `M ${x} ${y}`,
    `H ${end - r}`,
    `Q ${end} ${y} ${end} ${y + r}`,
    `V ${y + height - r}`,
    `Q ${end} ${y + height} ${end - r} ${y + height}`,
    `H ${x}`,
    "Z",
  ].join(" ");
}

function roundedTopColumnPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  const bottom = y + height;
  const end = x + width;

  return [
    `M ${x} ${bottom}`,
    `V ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `H ${end - r}`,
    `Q ${end} ${y} ${end} ${y + r}`,
    `V ${bottom}`,
    "Z",
  ].join(" ");
}

function pathForLine(
  values: Array<number | null>,
  labels: string[],
  xForIndex: (index: number) => number,
  yForValue: (value: number) => number,
) {
  let drawing = "";
  let open = false;

  labels.forEach((_, index) => {
    const value = values[index] ?? null;

    if (value === null) {
      open = false;
      return;
    }

    const command = open ? "L" : "M";
    drawing += `${command} ${xForIndex(index)} ${yForValue(value)} `;
    open = true;
  });

  return drawing.trim();
}

export function Sparkline({ highlightLast = false, values }: SparklineProps) {
  const width = 120;
  const height = 32;
  const padding = 4;
  const points = useMemo(() => {
    if (values.length === 0) {
      return [];
    }

    const { min, max } = range(values);
    const spread = max - min || 1;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    return values.map((value, index) => {
      const x = pointX(index, values.length, padding, plotWidth);
      const y = padding + plotHeight - ((value - min) / spread) * plotHeight;
      return { x, y };
    });
  }, [values]);

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const last = points[points.length - 1];

  return (
    <svg
      aria-hidden="true"
      className="app-dash-sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
    >
      <path className="app-dash-sparkline__path" d={line} />
      {highlightLast && last ? (
        <circle className="app-dash-sparkline__dot" cx={last.x} cy={last.y} r={4} />
      ) : null}
    </svg>
  );
}

export function LineChart({ format, height = 320, labels, series }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [frameRef, lineWidth] = useMeasuredWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const values = series.flatMap((item) =>
    item.values.filter((value): value is number => value !== null),
  );
  const min = Math.min(0, ...values);
  const step = niceStep((Math.max(...values, 1) - min) / 4);
  const max = min + step * Math.ceil((Math.max(...values, 1) - min) / step);
  const plotWidth = lineWidth - CHART_LEFT - CHART_RIGHT;
  const plotHeight = height - CHART_TOP - CHART_BOTTOM;
  const tickValues = Array.from(
    { length: Math.round((max - min) / step) + 1 },
    (_, index) => min + step * index,
  );
  const xForIndex = (index: number) => pointX(index, labels.length, CHART_LEFT, plotWidth);
  const yForValue = (value: number) =>
    CHART_TOP + plotHeight - ((value - min) / (max - min || 1)) * plotHeight;
  const activeX = activeIndex === null ? null : xForIndex(activeIndex);
  const tooltipRows =
    activeIndex === null
      ? []
      : series
          .map((item) => ({ name: item.name, value: item.values[activeIndex] }))
          .filter((item): item is { name: string; value: number } => item.value !== null);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (labels.length === 0 || svgRef.current === null) {
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * lineWidth;
    const raw = ((x - CHART_LEFT) / plotWidth) * (labels.length - 1);
    setActiveIndex(clamp(Math.round(raw), 0, labels.length - 1));
  };

  return (
    <div className="app-dash-chart app-dash-line-chart">
      {series.length >= 2 ? (
        <div className="app-dash-chart__legend" aria-hidden="true">
          {series.map((item) => (
            <span className="app-dash-chart__legend-item" key={item.name}>
              <span
                className={cx(
                  "app-dash-chart__legend-key",
                  `app-dash-chart__legend-key--${item.tone}`,
                  item.dashed && "app-dash-chart__legend-key--dashed",
                )}
              />
              {item.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="app-dash-chart__frame" ref={frameRef}>
        <svg
          aria-label="Line chart"
          className="app-dash-chart__svg"
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={handlePointerMove}
          ref={svgRef}
          role="img"
          viewBox={`0 0 ${lineWidth} ${height}`}
          width="100%"
        >
          {tickValues.map((tick) => {
            const y = yForValue(tick);

            return (
              <g className="app-dash-chart__tick" key={tick}>
                <line x1={CHART_LEFT} x2={lineWidth - CHART_RIGHT} y1={y} y2={y} />
                <text x={0} y={y + 4}>
                  {format(tick)}
                </text>
              </g>
            );
          })}
          {labels.map((label, index) => (
            <text
              className="app-dash-chart__axis-label"
              key={`${label}-${index}`}
              x={xForIndex(index)}
              y={height - 8}
            >
              {label}
            </text>
          ))}
          {series.map((item) => (
            <path
              className={cx(
                "app-dash-chart__line",
                `app-dash-chart__line--${item.tone}`,
                item.dashed && "app-dash-chart__line--dashed",
              )}
              d={pathForLine(item.values, labels, xForIndex, yForValue)}
              key={item.name}
            />
          ))}
          {series.map((item) => {
            const lastIndex = item.values.findLastIndex((value) => value !== null);

            // Only label series that reach the right edge; a mid-chart label collides with the line that continues it.
            if (lastIndex < 0 || lastIndex !== labels.length - 1) {
              return null;
            }

            const value = item.values[lastIndex];

            if (value === null) {
              return null;
            }

            return (
              <text
                className="app-dash-chart__end-label"
                key={`${item.name}-end`}
                x={xForIndex(lastIndex) + 8}
                y={clamp(yForValue(value), CHART_TOP + 12, height - CHART_BOTTOM)}
              >
                {format(value)}
              </text>
            );
          })}
          {activeX === null ? null : (
            <line
              className="app-dash-chart__crosshair"
              x1={activeX}
              x2={activeX}
              y1={CHART_TOP}
              y2={height - CHART_BOTTOM}
            />
          )}
          <rect
            className="app-dash-chart__hit-area"
            height={plotHeight}
            width={plotWidth}
            x={CHART_LEFT}
            y={CHART_TOP}
          />
        </svg>
        {activeIndex === null || activeX === null ? null : (
          <div
            className="app-dash-chart__tooltip"
            style={{ left: `${(activeX / lineWidth) * 100}%`, top: `${CHART_TOP}px` }}
          >
            <div className="app-dash-chart__tooltip-label">{labels[activeIndex]}</div>
            {tooltipRows.map((row) => (
              <div className="app-dash-chart__tooltip-row" key={row.name}>
                <span>{row.name}</span>
                <strong>{format(row.value)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BarChart({ format, items, max }: BarChartProps) {
  const [rootRef, chartWidth] = useMeasuredWidth<HTMLDivElement>();
  const height = Math.max(96, items.length * 42 + 24);
  const left = 172;
  const right = 108;
  const plotWidth = chartWidth - left - right;
  const maxValue = Math.max(max ?? 0, ...items.map((item) => item.value)) || 1;

  return (
    <div className="app-dash-chart app-dash-bar-chart" ref={rootRef}>
      <svg
        aria-label="Bar chart"
        className="app-dash-chart__svg"
        role="img"
        viewBox={`0 0 ${chartWidth} ${height}`}
        width="100%"
      >
        {items.map((item, index) => {
          const y = 20 + index * 42;
          const width = (plotWidth * item.value) / maxValue;

          return (
            <g className="app-dash-bar-chart__row" key={item.label}>
              <title>{`${item.label}: ${format(item.value)}${item.note ? ` · ${item.note}` : ""}`}</title>
              <text className="app-dash-bar-chart__label" x={0} y={y + 14}>
                {item.label}
              </text>
              <path
                className={cx(
                  "app-dash-bar-chart__bar",
                  item.highlight && "app-dash-bar-chart__bar--highlight",
                )}
                d={roundedRightBarPath(left, y, width, 16, 4)}
              />
              <text className="app-dash-bar-chart__value" x={left + width + 10} y={y + 13}>
                {format(item.value)}
              </text>
              {item.note ? (
                <text className="app-dash-bar-chart__note" x={left} y={y + 32}>
                  {item.note}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Funnel({ stages }: FunnelProps) {
  const [rootRef, chartWidth] = useMeasuredWidth<HTMLDivElement>();
  const height = Math.max(96, stages.length * 46 + 20);
  const left = 156;
  const right = 136;
  const plotWidth = chartWidth - left - right;
  const max = Math.max(...stages.map((stage) => stage.count), 1);
  const opacities = [1, 0.8, 0.6, 0.45, 0.3];

  return (
    <div className="app-dash-chart app-dash-funnel" ref={rootRef}>
      <svg
        aria-label="Funnel chart"
        className="app-dash-chart__svg"
        role="img"
        viewBox={`0 0 ${chartWidth} ${height}`}
        width="100%"
      >
        {stages.map((stage, index) => {
          const y = 18 + index * 46;
          const width = (plotWidth * stage.count) / max;
          const previous = stages[index - 1];
          const conversion =
            previous && previous.count > 0 ? `${Math.round((stage.count / previous.count) * 100)}%` : "";

          return (
            <g className="app-dash-funnel__row" key={stage.label}>
              <text className="app-dash-funnel__label" x={0} y={y + 15}>
                {stage.label}
              </text>
              <path
                className="app-dash-funnel__bar"
                d={roundedRightBarPath(left, y, width, 18, 4)}
                style={{ opacity: opacities[index] ?? opacities[opacities.length - 1] }}
              />
              <text className="app-dash-funnel__count" x={left + width + 10} y={y + 14}>
                {stage.value ?? stage.count.toLocaleString("en-US")}
              </text>
              {conversion ? (
                <text className="app-dash-funnel__conversion" x={left} y={y + 36}>
                  {conversion} from previous
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Meter({ caption, label, target, value }: MeterProps) {
  const bounded = clamp(value, 0, 1);
  const boundedTarget = target === undefined ? null : clamp(target, 0, 1);

  return (
    <div className="app-dash-meter">
      {label ? <div className="app-dash-meter__label">{label}</div> : null}
      <div className="app-dash-meter__track" aria-label={label} role="meter" aria-valuenow={bounded}>
        <span className="app-dash-meter__fill" style={{ width: `${bounded * 100}%` }} />
        {boundedTarget === null ? null : (
          <span className="app-dash-meter__target" style={{ left: `${boundedTarget * 100}%` }} />
        )}
      </div>
      {caption ? <div className="app-dash-meter__caption">{caption}</div> : null}
    </div>
  );
}

export function ColumnChart({ format, highlightIndex, labels, values }: ColumnChartProps) {
  const [rootRef, chartWidth] = useMeasuredWidth<HTMLDivElement>();
  const height = 280;
  const left = 54;
  const right = 34;
  const top = 18;
  const bottom = 42;
  const plotWidth = chartWidth - left - right;
  const plotHeight = height - top - bottom;
  const step = niceStep(Math.max(...values, 0) / 4);
  const max = step * Math.max(1, Math.ceil(Math.max(...values, 0) / step));
  const band = values.length > 0 ? plotWidth / values.length : plotWidth;
  const columnWidth = Math.min(24, band * 0.55);
  const yForValue = (value: number) => top + plotHeight - (value / max) * plotHeight;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, index) => step * index);

  return (
    <div className="app-dash-chart app-dash-column-chart" ref={rootRef}>
      <svg
        aria-label="Column chart"
        className="app-dash-chart__svg"
        role="img"
        viewBox={`0 0 ${chartWidth} ${height}`}
        width="100%"
      >
        {ticks.map((tick) => {
          const y = yForValue(tick);

          return (
            <g className="app-dash-chart__tick" key={tick}>
              <line x1={left} x2={chartWidth - right} y1={y} y2={y} />
              <text x={0} y={y + 4}>
                {format(tick)}
              </text>
            </g>
          );
        })}
        {values.map((value, index) => {
          const x = left + band * index + (band - columnWidth) / 2;
          const y = yForValue(value);
          const columnHeight = top + plotHeight - y;

          return (
            <g key={`${labels[index]}-${index}`}>
              <title>{`${labels[index]}: ${format(value)}`}</title>
              <path
                className={cx(
                  "app-dash-column-chart__column",
                  index === highlightIndex && "app-dash-column-chart__column--highlight",
                )}
                d={roundedTopColumnPath(x, y, columnWidth, columnHeight, 4)}
              />
              <text className="app-dash-chart__axis-label" x={x + columnWidth / 2} y={height - 10}>
                {labels[index]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
