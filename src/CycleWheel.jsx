import { colors } from "./theme";

export default function CycleWheel({ avgCycleLen, currentCycleDay, avgPeriodLen }) {
  const size = 156;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dayInCycle = currentCycleDay ? ((currentCycleDay - 1) % avgCycleLen) + 1 : null;
  const periodFrac = Math.min(avgPeriodLen / avgCycleLen, 1);
  const periodArc = c * periodFrac;
  const pointerAngle = dayInCycle ? (dayInCycle / avgCycleLen) * 360 - 90 : -90;
  const px = size / 2 + r * Math.cos((pointerAngle * Math.PI) / 180);
  const py = size / 2 + r * Math.sin((pointerAngle * Math.PI) / 180);

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.surfaceAlt} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colors.rose}
        strokeWidth={stroke}
        strokeDasharray={`${periodArc} ${c - periodArc}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {dayInCycle && <circle cx={px} cy={py} r={7} fill={colors.gold} stroke={colors.surface} strokeWidth={2} />}
      <text x="50%" y="46%" textAnchor="middle" fontSize="24" fontWeight="600" fill={colors.primaryDark} fontFamily="'Fraunces', serif">
        {dayInCycle ?? "–"}
      </text>
      <text x="50%" y="60%" textAnchor="middle" fontSize="10" fill={colors.muted}>
        day of cycle
      </text>
    </svg>
  );
}
