import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DATA = {
  temps:  [31, 33, 34, 30, 28, 29, 32],
  humid:  [75, 72, 70, 80, 85, 82, 76],
  rain:   [10,  5, 15, 70, 90, 65, 20],
  wind:   [12, 18, 22, 28, 25, 16, 14],
  uv:     [ 8,  9, 10,  5,  3,  4,  7],
};

const HOURLY = [
  { time: "06:00", icon: "🌤", temp: 28 },
  { time: "08:00", icon: "⛅", temp: 30 },
  { time: "10:00", icon: "☀️", temp: 32 },
  { time: "NOW",   icon: "☀️", temp: 34, now: true },
  { time: "16:00", icon: "🌥", temp: 33 },
  { time: "18:00", icon: "🌦", temp: 31 },
  { time: "20:00", icon: "🌧", temp: 29 },
  { time: "22:00", icon: "🌙", temp: 27 },
];

const CONDITIONS = [
  { label: "Sunny",  value: 14, color: "#e2703a" },
  { label: "Cloudy", value:  9, color: "#888780" },
  { label: "Rainy",  value:  5, color: "#4992d3" },
  { label: "Stormy", value:  2, color: "#7b63c8" },
];

// ─── SVG Chart Helpers ────────────────────────────────────────────────────────

/** Maps a data value to a Y pixel coordinate within a chart area */
function scaleY(val, min, max, height, padTop = 10, padBot = 10) {
  const range = max - min || 1;
  return padTop + ((max - val) / range) * (height - padTop - padBot);
}

/** Maps an index to an X pixel coordinate */
function scaleX(i, total, width, padL = 30, padR = 10) {
  const usable = width - padL - padR;
  return padL + (i / (total - 1)) * usable;
}

// ─── Line Chart (Temperature + Humidity dual axis) ────────────────────────────
function LineChart({ width = 400, height = 180 }) {
  const padL = 36, padR = 36, padT = 10, padB = 28;
  const n = DAYS.length;

  const tempMin = 24, tempMax = 38;
  const humMin  = 60, humMax  = 92;

  const tempPoints = DATA.temps.map((v, i) => [
    scaleX(i, n, width, padL, padR),
    scaleY(v, tempMin, tempMax, height, padT, padB),
  ]);

  const humPoints = DATA.humid.map((v, i) => [
    scaleX(i, n, width, padL, padR),
    scaleY(v, humMin, humMax, height, padT, padB),
  ]);

  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  const toArea = (pts, h, pb) =>
    toPath(pts) + ` L${pts[pts.length-1][0].toFixed(1)},${h - pb} L${pts[0][0].toFixed(1)},${h - pb} Z`;

  // Y-axis ticks for temperature
  const tempTicks = [26, 30, 34, 38];
  const humTicks  = [65, 72, 80, 88];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {/* Grid lines */}
      {tempTicks.map((t) => {
        const y = scaleY(t, tempMin, tempMax, height, padT, padB);
        return <line key={t} x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e0e0dc" strokeWidth="0.5" />;
      })}

      {/* Area fills */}
      <path d={toArea(humPoints, height, padB)} fill="rgba(73,146,211,0.08)" />
      <path d={toArea(tempPoints, height, padB)} fill="rgba(226,112,58,0.08)" />

      {/* Lines */}
      <path d={toPath(humPoints)}  fill="none" stroke="#4992d3" strokeWidth="1.8" strokeLinejoin="round" />
      <path d={toPath(tempPoints)} fill="none" stroke="#e2703a" strokeWidth="1.8" strokeLinejoin="round" />

      {/* Dots */}
      {tempPoints.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#e2703a" />)}
      {humPoints.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#4992d3" />)}

      {/* X-axis labels */}
      {DAYS.map((d, i) => (
        <text key={d} x={scaleX(i, n, width, padL, padR)} y={height - 6}
          textAnchor="middle" fontSize="10" fill="#aaa">{d}</text>
      ))}

      {/* Left Y-axis (temp) */}
      {tempTicks.map((t) => (
        <text key={t} x={padL - 4} y={scaleY(t, tempMin, tempMax, height, padT, padB) + 4}
          textAnchor="end" fontSize="9" fill="#e2703a">{t}°</text>
      ))}

      {/* Right Y-axis (humidity) */}
      {humTicks.map((t) => (
        <text key={t} x={width - padR + 4} y={scaleY(t, humMin, humMax, height, padT, padB) + 4}
          textAnchor="start" fontSize="9" fill="#4992d3">{t}%</text>
      ))}
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ values, colors, unit = "", max: maxProp, width = 300, height = 160, yLabel }) {
  const padL = 34, padR = 10, padT = 10, padB = 28;
  const n = values.length;
  const max = maxProp ?? Math.ceil(Math.max(...values) * 1.2);
  const min = 0;
  const usableW = width - padL - padR;
  const barW = (usableW / n) * 0.55;
  const gap  = usableW / n;

  const ticks = [0, Math.round(max * 0.33), Math.round(max * 0.67), max];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {/* Grid */}
      {ticks.map((t) => {
        const y = scaleY(t, min, max, height, padT, padB);
        return <line key={t} x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e0e0dc" strokeWidth="0.5" />;
      })}

      {/* Bars */}
      {values.map((v, i) => {
        const x = padL + i * gap + (gap - barW) / 2;
        const y = scaleY(v, min, max, height, padT, padB);
        const barH = height - padB - y;
        const fill = Array.isArray(colors) ? colors[i] : colors;
        return (
          <rect key={i} x={x} y={y} width={barW} height={Math.max(barH, 0)}
            fill={fill} rx="3" />
        );
      })}

      {/* X labels */}
      {DAYS.map((d, i) => (
        <text key={d} x={padL + i * gap + gap / 2} y={height - 6}
          textAnchor="middle" fontSize="10" fill="#aaa">{d}</text>
      ))}

      {/* Y labels */}
      {ticks.map((t) => (
        <text key={t} x={padL - 4} y={scaleY(t, min, max, height, padT, padB) + 4}
          textAnchor="end" fontSize="9" fill="#aaa">{t}{unit}</text>
      ))}
    </svg>
  );
}

// ─── Wind Line Chart ──────────────────────────────────────────────────────────
function WindLineChart({ width = 300, height = 150 }) {
  const padL = 38, padR = 10, padT = 10, padB = 28;
  const n = DAYS.length;
  const min = 0, max = 35;

  const pts = DATA.wind.map((v, i) => [
    scaleX(i, n, width, padL, padR),
    scaleY(v, min, max, height, padT, padB),
  ]);

  const toPath = (p) =>
    p.map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ");

  const areaPath =
    toPath(pts) +
    ` L${pts[pts.length-1][0].toFixed(1)},${height - padB} L${pts[0][0].toFixed(1)},${height - padB} Z`;

  const ticks = [0, 10, 20, 30];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {ticks.map((t) => {
        const y = scaleY(t, min, max, height, padT, padB);
        return <line key={t} x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e0e0dc" strokeWidth="0.5" />;
      })}
      <path d={areaPath} fill="rgba(123,99,200,0.1)" />
      <path d={toPath(pts)} fill="none" stroke="#7b63c8" strokeWidth="1.8" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#7b63c8" />)}
      {DAYS.map((d, i) => (
        <text key={d} x={scaleX(i, n, width, padL, padR)} y={height - 6}
          textAnchor="middle" fontSize="10" fill="#aaa">{d}</text>
      ))}
      {ticks.map((t) => (
        <text key={t} x={padL - 4} y={scaleY(t, min, max, height, padT, padB) + 4}
          textAnchor="end" fontSize="9" fill="#aaa">{t}</text>
      ))}
    </svg>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ width = 200, height = 150 }) {
  const cx = 70, cy = height / 2, r = 52, inner = 30;
  const total = CONDITIONS.reduce((s, c) => s + c.value, 0);
  let angle = -Math.PI / 2;
  const slices = CONDITIONS.map((c) => {
    const sweep = (c.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const xi1 = cx + inner * Math.cos(angle - sweep);
    const yi1 = cy + inner * Math.sin(angle - sweep);
    const xi2 = cx + inner * Math.cos(angle);
    const yi2 = cy + inner * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...c,
      d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi2.toFixed(2)},${yi2.toFixed(2)} A${inner},${inner} 0 ${large},0 ${xi1.toFixed(2)},${yi1.toFixed(2)} Z`,
    };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {slices.map((s) => <path key={s.label} d={s.d} fill={s.color} />)}
      {/* Legend */}
      {CONDITIONS.map((c, i) => (
        <g key={c.label} transform={`translate(${cx * 2 + 10}, ${16 + i * 28})`}>
          <rect width="10" height="10" rx="2" fill={c.color} />
          <text x="14" y="9" fontSize="11" fill="#555">{c.label}</text>
          <text x="14" y="21" fontSize="9" fill="#aaa">{Math.round((c.value / total) * 100)}%</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, unit, change, dir }) {
  const changeColor = dir === "up" ? "#3d9c6e" : dir === "down" ? "#c94a4a" : "#888";
  return (
    <div style={s.statCard}>
      <p style={s.statLabel}>{label}</p>
      <p style={s.statVal}>{value}<span style={s.statUnit}>{unit}</span></p>
      <p style={{ ...s.statChange, color: changeColor }}>{change}</p>
    </div>
  );
}

function ChartCard({ title, sub, legend, children }) {
  return (
    <div style={s.chartCard}>
      <p style={s.chartTitle}>{title}</p>
      <p style={s.chartSub}>{sub}</p>
      {legend && <div style={s.legendRow}>{legend}</div>}
      {children}
    </div>
  );
}

function LegDot({ color, label }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function WeatherDashboard() {
  const [tab, setTab] = useState("today");

  const uvColors = DATA.uv.map((v) =>
    v >= 8 ? "#e2703a" : v >= 6 ? "#f0b429" : "#a0c878"
  );
  const rainColors = DATA.rain.map((v) =>
    v > 60 ? "#4992d3" : "rgba(73,146,211,0.4)"
  );

  return (
    <div style={s.dash}>
      {/* Top bar */}
      <div style={s.topbar}>
        <div>
          <h1 style={s.cityName}>Mumbai, IN</h1>
          <p style={s.citySub}>Last updated: 03 Apr 2026 · 14:32 IST</p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["today", "week", "month"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero stats */}
      <div style={s.heroGrid}>
        <StatCard label="Temperature" value="34" unit="°C"   change="↑ 3° from yesterday" dir="up" />
        <StatCard label="Humidity"    value="72" unit="%"    change="↓ 5% from yesterday" dir="down" />
        <StatCard label="Wind Speed"  value="18" unit=" km/h" change="→ SW direction" />
      </div>

      {/* Hourly strip */}
      <div style={s.hourlyRow}>
        {HOURLY.map((h) => (
          <div key={h.time} style={{ ...s.hourItem, ...(h.now ? s.hourNow : {}) }}>
            <p style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{h.time}</p>
            <p style={{ fontSize: 18, margin: "2px 0" }}>{h.icon}</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{h.temp}°</p>
          </div>
        ))}
      </div>

      {/* Main chart row */}
      <div style={s.chartGrid}>
        <ChartCard
          title="Temperature & Humidity"
          sub="7-day trend"
          legend={
            <>
              <LegDot color="#e2703a" label="Temp (°C)" />
              <LegDot color="#4992d3" label="Humidity (%)" />
            </>
          }
        >
          <LineChart width={480} height={180} />
        </ChartCard>

        <ChartCard title="Rain Probability" sub="Next 7 days · %">
          <BarChart values={DATA.rain} colors={rainColors} unit="%" max={100} width={260} height={180} />
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div style={s.bottomGrid}>
        <ChartCard title="Wind Speed" sub="km/h · daily avg">
          <WindLineChart width={280} height={150} />
        </ChartCard>

        <ChartCard title="UV Index" sub="Daily peak · scale 0–11">
          <BarChart values={DATA.uv} colors={uvColors} max={11} width={280} height={150} />
        </ChartCard>

        <ChartCard title="Conditions" sub="Monthly distribution">
          <DonutChart width={240} height={150} />
        </ChartCard>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  dash: {
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "sans-serif",
    background: "#f5f5f3",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  cityName: { fontSize: 28, fontWeight: 700, letterSpacing: -0.5, margin: 0 },
  citySub:  { fontSize: 13, color: "#888", marginTop: 2 },

  tab: {
    fontSize: 12,
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: "transparent",
    cursor: "pointer",
    color: "#666",
  },
  tabActive: { background: "#111", color: "#fff", borderColor: "transparent" },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    background: "#fff",
    border: "0.5px solid #e0e0dc",
    borderRadius: 12,
    padding: "16px 20px",
  },
  statLabel: {
    fontSize: 11,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
  },
  statVal:    { fontSize: 32, fontWeight: 700, letterSpacing: -1, lineHeight: 1 },
  statUnit:   { fontSize: 14, color: "#888", fontWeight: 400 },
  statChange: { fontSize: 12, marginTop: 4 },

  hourlyRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
    marginBottom: 14,
  },
  hourItem: {
    background: "#fff",
    border: "0.5px solid #e0e0dc",
    borderRadius: 12,
    padding: "10px 14px",
    textAlign: "center",
    minWidth: 68,
    flexShrink: 0,
  },
  hourNow: { borderColor: "#333", background: "#f0f0ee" },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 12,
    marginBottom: 14,
  },
  chartCard: {
    background: "#fff",
    border: "0.5px solid #e0e0dc",
    borderRadius: 12,
    padding: "16px 20px",
  },
  chartTitle: { fontSize: 13, fontWeight: 600, marginBottom: 4 },
  chartSub:   { fontSize: 11, color: "#aaa", marginBottom: 12 },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  legendRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 },
};