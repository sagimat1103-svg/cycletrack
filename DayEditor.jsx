import { useState } from "react";
import { X } from "lucide-react";
import Slider from "./Slider";
import { colors, button } from "./theme";
import { fmtLong, parseKey } from "./cycleMath";

const HEAVINESS = ["Light", "Medium", "Heavy"];
const COLOR_OPTIONS = [
  { label: "Bright red", hex: "#C4283C" },
  { label: "Dark red", hex: "#7A1F2B" },
  { label: "Brown", hex: "#6B4226" },
  { label: "Pink", hex: "#E58FA0" },
  { label: "Orange-tinted", hex: "#C97A46" },
];

export default function DayEditor({ dateKey, entry, onSave, onRemove, onClose }) {
  const [mood, setMood] = useState(entry?.mood ?? 5);
  const [cramps, setCramps] = useState(entry?.cramps ?? 5);
  const [cravings, setCravings] = useState(entry?.cravings ?? 5);
  const [tiredness, setTiredness] = useState(entry?.tiredness ?? 5);
  const [heaviness, setHeaviness] = useState(entry?.heaviness ?? "Medium");
  const [color, setColor] = useState(entry?.color ?? "Bright red");
  const [saving, setSaving] = useState(false);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(46,31,43,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: colors.surface,
          borderRadius: "24px 24px 0 0",
          padding: 20,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", color: colors.primaryDark, fontSize: 18, fontWeight: 600, margin: 0 }}>
            {fmtLong(parseKey(dateKey))}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none" }}>
            <X size={20} style={{ color: colors.muted }} />
          </button>
        </div>

        <Slider label="Mood" value={mood} onChange={setMood} accent={colors.primary} />
        <Slider label="Cramps" value={cramps} onChange={setCramps} accent={colors.rose} />
        <Slider label="Cravings" value={cravings} onChange={setCravings} accent={colors.gold} />
        <Slider label="Tiredness" value={tiredness} onChange={setTiredness} accent={colors.sage} />

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, marginBottom: 6, color: colors.inkSoft }}>Heaviness</p>
          <div style={{ display: "flex", gap: 8 }}>
            {HEAVINESS.map((h) => (
              <button
                key={h}
                onClick={() => setHeaviness(h)}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  padding: "8px 0",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  backgroundColor: heaviness === h ? colors.primary : colors.surfaceAlt,
                  color: heaviness === h ? "white" : colors.inkSoft,
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, marginBottom: 6, color: colors.inkSoft }}>Color</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.label}
                onClick={() => setColor(c.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  color: colors.inkSoft,
                  backgroundColor: "transparent",
                  border: color === c.label ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c.hex, display: "inline-block" }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={async () => {
              setSaving(true);
              await onRemove(dateKey);
              setSaving(false);
            }}
            disabled={saving}
            style={{ ...button.ghost, flex: 1, borderColor: colors.coral, color: colors.coral }}
          >
            Not a period day
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              await onSave(dateKey, { mood, cramps, cravings, tiredness, heaviness, color });
              setSaving(false);
            }}
            disabled={saving}
            style={{ ...button.primary, flex: 1, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
