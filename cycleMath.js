export const pad = (n) => String(n).padStart(2, "0");
export const dkey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
export const diffDays = (a, b) => {
  const x = new Date(a);
  const y = new Date(b);
  x.setHours(0, 0, 0, 0);
  y.setHours(0, 0, 0, 0);
  return Math.round((x - y) / 86400000);
};
export const sameDay = (a, b) => dkey(a) === dkey(b);
export const fmtLong = (d) => d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
export const fmtShort = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function ageBracketNote(age) {
  const a = Number(age);
  if (!a) return "";
  if (a < 20) return "At this age cycles are often irregular (21–45 days) while your body settles into a rhythm — that's typical, not a red flag.";
  if (a < 40) return "This is usually the most stable stretch, with cycles commonly running 23–35 days.";
  if (a < 50) return "Cycles can start becoming less predictable in your 40s as hormone levels shift — this is perimenopause, and irregularity is common.";
  return "Periods typically stop around age 51–52. If it's been 12 full months without one, that marks menopause.";
}

// logsByDate: { 'YYYY-MM-DD': {...} }
export function computeCycleStats(logsByDate, profile) {
  const dates = Object.keys(logsByDate).sort();
  if (dates.length === 0) {
    return {
      instances: [],
      avgCycleLen: Number(profile?.avg_cycle_length) || 28,
      avgPeriodLen: Number(profile?.avg_period_length) || 5,
      dataDriven: false,
    };
  }

  const instances = [];
  let currentRun = [parseKey(dates[0])];
  for (let i = 1; i < dates.length; i++) {
    const d = parseKey(dates[i]);
    const prev = currentRun[currentRun.length - 1];
    if (diffDays(d, prev) === 1) {
      currentRun.push(d);
    } else {
      instances.push(currentRun);
      currentRun = [d];
    }
  }
  instances.push(currentRun);

  const starts = instances.map((run) => run[0]);
  let avgCycleLen = Number(profile?.avg_cycle_length) || 28;
  let dataDriven = false;
  if (starts.length >= 2) {
    const gaps = [];
    for (let i = 1; i < starts.length; i++) gaps.push(diffDays(starts[i], starts[i - 1]));
    avgCycleLen = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    dataDriven = true;
  }
  const avgPeriodLen = instances.length
    ? Math.round(instances.reduce((s, r) => s + r.length, 0) / instances.length)
    : Number(profile?.avg_period_length) || 5;

  return { instances, avgCycleLen, avgPeriodLen, dataDriven };
}

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const gridStart = addDays(first, -startOffset);
  const days = [];
  for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
  return days;
}
