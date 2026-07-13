export const colors = {
  bg: "#F7F1F3",
  surface: "#FFFFFF",
  surfaceAlt: "#F1E3EA",
  ink: "#2E1F2B",
  inkSoft: "#5B4650",
  primary: "#6B3654",
  primaryDark: "#4A2440",
  rose: "#D66A8C",
  roseSoft: "#F0C4D3",
  gold: "#C79A4B",
  sage: "#7C9885",
  coral: "#C6543D",
  muted: "#9B8A93",
  border: "#E6D6DE",
};

export const card = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 20,
};

export const button = {
  primary: {
    backgroundColor: colors.primary,
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 16px",
    fontWeight: 600,
    fontSize: 14,
  },
  ghost: {
    backgroundColor: "transparent",
    color: colors.inkSoft,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: "10px 16px",
    fontWeight: 500,
    fontSize: 14,
  },
};

export const input = {
  width: "100%",
  border: `1px solid ${colors.border}`,
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 14,
  color: colors.ink,
};

export const row = { display: "flex", alignItems: "center" };
export const rowBetween = { display: "flex", alignItems: "center", justifyContent: "space-between" };
export const col = { display: "flex", flexDirection: "column" };
