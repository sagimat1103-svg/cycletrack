import { useState } from "react";
import { ChevronLeft, ChevronRight, Settings, Droplets, Info, LogOut } from "lucide-react";
import CycleWheel from "./CycleWheel";
import DayEditor from "./DayEditor";
import { colors, card } from "./theme";
import { dkey, sameDay, fmtShort, addDays, diffDays, getMonthGrid, computeCycleStats, ageBracketNote } from "./cycleMath";

export default function Dashboard({ profile, logs, onEditProfile, onDaySave, onDayRemove, onSignOut, saveError }) {
  const [monthCursor, setMonthCursor] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [editingDate, setEditingDate] = useState(null);

  const stats = computeCycleStats(logs, profile);
  const today = new Date();
  const lastInstance = stats.instances[stats.instances.length - 1];
  const lastStart = lastInstance ? lastInstance[0] : null;
  const predictedNext = lastStart ? addDays(lastStart, stats.avgCycleLen) : null;
  const daysUntilNext = predictedNext ? diffDays(predictedNext, today) : null;
  const currentCycleDay = lastStart ? diffDays(today, lastStart) + 1 : null;

  const grid = getMonthGrid(monthCursor.getFullYear(), monthCursor.getMonth());
  const weeks = [];
  for (let i = 0; i < 6; i++) weeks.push(grid.slice(i * 7, i * 7 + 7));

  function toggleDay(date) {
    const key = dkey(date);
    if (!logs[key]) {
      onDaySave(key, { mood: 5, cramps: 5, cravings: 5, tiredness: 5, heaviness: "Medium", color: "Bright red" });
    }
    setEditingDate(key);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bg, paddingBottom: 64 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.rose, margin: 0 }}>Cycle tracker</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", color: colors.primaryDark, fontSize: 22, fontWeight: 600, margin: "2px 0 0" }}>
              {today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onEditProfile} style={iconBtnStyle}>
              <Settings size={18} style={{ color: colors.inkSoft }} />
            </button>
            <button onClick={onSignOut} style={iconBtnStyle}>
              <LogOut size={18} style={{ color: colors.inkSoft }} />
            </button>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <CycleWheel avgCycleLen={stats.avgCycleLen} currentCycleDay={currentCycleDay} avgPeriodLen={stats.avgPeriodLen} />
          <div style={{ flex: 1 }}>
            {lastStart ? (
              <>
                <p style={{ fontSize: 13, color: colors.inkSoft, margin: 0 }}>Last period started</p>
                <p style={{ fontWeight: 600, color: colors.ink, margin: "0 0 8px" }}>{fmtShort(lastStart)}</p>
                <p style={{ fontSize: 13, color: colors.inkSoft, margin: 0 }}>Next period estimated</p>
                <p style={{ fontWeight: 600, color: colors.primary, margin: 0 }}>
                  {fmtShort(predictedNext)} {daysUntilNext >= 0 ? `(in ${daysUntilNext}d)` : `(${Math.abs(daysUntilNext)}d ago)`}
                </p>
                <p style={{ fontSize: 11, marginTop: 8, color: colors.muted }}>
                  {stats.dataDriven
                    ? `Based on your logged cycles, averaging ${stats.avgCycleLen} days.`
                    : `Based on the average cycle length you entered (${stats.avgCycleLen} days). Log a couple of cycles for a more personal estimate.`}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: colors.inkSoft, margin: 0 }}>
                Tap days on the calendar below to mark your period, and I'll estimate your next cycle once one is logged.
              </p>
            )}
          </div>
        </div>

        {profile.age && (
          <div style={{ ...card, backgroundColor: colors.surfaceAlt, border: "none", marginBottom: 20, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Info size={16} style={{ color: colors.primary, marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: colors.inkSoft, margin: 0 }}>{ageBracketNote(profile.age)}</p>
          </div>
        )}

        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))} style={plainBtnStyle}>
              <ChevronLeft size={20} style={{ color: colors.inkSoft }} />
            </button>
            <p style={{ fontWeight: 600, color: colors.ink, fontFamily: "'Fraunces', serif", margin: 0 }}>
              {monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
            <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))} style={plainBtnStyle}>
              <ChevronRight size={20} style={{ color: colors.inkSoft }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 12, color: colors.muted }}>{d}</div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
              {week.map((day, di) => {
                const key = dkey(day);
                const inMonth = day.getMonth() === monthCursor.getMonth();
                const entry = logs[key];
                const isToday = sameDay(day, today);
                const isPredicted = predictedNext && sameDay(day, predictedNext);
                return (
                  <button
                    key={di}
                    onClick={() => inMonth && toggleDay(day)}
                    disabled={!inMonth}
                    style={{
                      aspectRatio: "1 / 1",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      fontSize: 12,
                      backgroundColor: entry ? colors.rose : "transparent",
                      color: entry ? "white" : inMonth ? colors.ink : colors.border,
                      border: isToday ? `2px solid ${colors.gold}` : isPredicted ? `2px dashed ${colors.primary}` : "2px solid transparent",
                      opacity: inMonth ? 1 : 0.4,
                      fontWeight: isToday ? 700 : 500,
                    }}
                  >
                    {day.getDate()}
                    {entry && <Droplets size={9} style={{ position: "absolute", bottom: 2, color: "rgba(255,255,255,0.85)" }} />}
                  </button>
                );
              })}
            </div>
          ))}

          <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12, color: colors.muted, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: colors.rose, display: "inline-block" }} /> Period logged
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${colors.gold}`, display: "inline-block" }} /> Today
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", border: `2px dashed ${colors.primary}`, display: "inline-block" }} /> Estimated
            </span>
          </div>
        </div>

        {saveError && (
          <p style={{ fontSize: 12, textAlign: "center", marginBottom: 12, color: colors.coral }}>
            Couldn't save just now — check your connection and try again.
          </p>
        )}
      </div>

      {editingDate && (
        <DayEditor
          dateKey={editingDate}
          entry={logs[editingDate]}
          onSave={async (key, entry) => {
            await onDaySave(key, entry);
            setEditingDate(null);
          }}
          onRemove={async (key) => {
            await onDayRemove(key);
            setEditingDate(null);
          }}
          onClose={() => setEditingDate(null)}
        />
      )}
    </div>
  );
}

const iconBtnStyle = {
  padding: 8,
  borderRadius: 999,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
};

const plainBtnStyle = { background: "none", border: "none" };
