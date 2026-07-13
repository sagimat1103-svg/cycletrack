import { useState } from "react";
import { Moon } from "lucide-react";
import Slider from "./Slider";
import { colors, card, button, input as inputStyle } from "./theme";
import { ageBracketNote } from "./cycleMath";

export default function ProfileForm({ initial, onSave, onCancel, showCancel, saving }) {
  const [age, setAge] = useState(initial?.age ?? "");
  const [avgPeriodLength, setAvgPeriodLength] = useState(initial?.avg_period_length ?? 5);
  const [avgCycleLength, setAvgCycleLength] = useState(initial?.avg_cycle_length ?? 28);
  const [cramps, setCramps] = useState(initial?.cramps ?? 5);
  const [backPain, setBackPain] = useState(initial?.back_pain ?? 5);
  const [headaches, setHeadaches] = useState(initial?.headaches ?? 5);
  const [tiredness, setTiredness] = useState(initial?.tiredness ?? 5);

  const valid = age && Number(age) > 0 && Number(age) < 100;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bg, padding: 24 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Moon size={26} style={{ color: colors.gold }} />
          <h1 style={{ fontFamily: "'Fraunces', serif", color: colors.primaryDark, fontSize: 22, fontWeight: 600, margin: "8px 0 4px" }}>
            A few starting details
          </h1>
          <p style={{ fontSize: 13, color: colors.muted, margin: 0 }}>
            This helps shape your cycle estimates. You can edit it anytime.
          </p>
        </div>

        <div style={{ ...card, marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: colors.ink, display: "block", marginBottom: 4 }}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 27" style={inputStyle} />
          {age && <p style={{ fontSize: 12, marginTop: 8, color: colors.sage }}>{ageBracketNote(age)}</p>}
        </div>

        <div style={{ ...card, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: colors.ink, display: "block", marginBottom: 4 }}>Period lasts (days)</label>
            <input type="number" value={avgPeriodLength} onChange={(e) => setAvgPeriodLength(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: colors.ink, display: "block", marginBottom: 4 }}>Days between cycles</label>
            <input type="number" value={avgCycleLength} onChange={(e) => setAvgCycleLength(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ ...card, marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: colors.ink }}>How you typically feel (1–10)</p>
          <Slider label="Cramps" value={cramps} onChange={setCramps} accent={colors.rose} />
          <Slider label="Back pain" value={backPain} onChange={setBackPain} accent={colors.rose} />
          <Slider label="Headaches" value={headaches} onChange={setHeadaches} accent={colors.rose} />
          <Slider label="Tiredness" value={tiredness} onChange={setTiredness} accent={colors.rose} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {showCancel && (
            <button onClick={onCancel} style={{ ...button.ghost, flex: 1 }}>
              Cancel
            </button>
          )}
          <button
            disabled={!valid || saving}
            onClick={() =>
              onSave({
                age: Number(age),
                avg_period_length: Number(avgPeriodLength) || 5,
                avg_cycle_length: Number(avgCycleLength) || 28,
                cramps,
                back_pain: backPain,
                headaches,
                tiredness,
              })
            }
            style={{ ...button.primary, flex: 1, opacity: !valid || saving ? 0.5 : 1 }}
          >
            {saving ? "Saving…" : showCancel ? "Save changes" : "Start tracking"}
          </button>
        </div>
      </div>
    </div>
  );
}
