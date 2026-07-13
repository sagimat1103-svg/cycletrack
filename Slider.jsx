import { colors } from "./theme";

export default function Slider({ label, value, onChange, accent }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: colors.inkSoft }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: accent, width: "100%" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginTop: 2, color: colors.muted }}>
        <span>barely noticeable</span>
        <span>extreme</span>
      </div>
    </div>
  );
}
