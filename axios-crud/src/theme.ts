/**
 * Semantic design tokens.
 * Screens should reference these instead of hardcoding hex values,
 * so colour/spacing decisions stay in one place.
 */

export const colors = {
  // Brand
  primary: "#2563EB",
  primaryPressed: "#1D4ED8",
  onPrimary: "#FFFFFF",

  // Surfaces
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfacePressed: "#F1F5F9",

  // Text
  text: "#0F172A",
  textMuted: "#64748B",

  // Lines
  border: "#E2E8F0",

  // Status
  danger: "#DC2626",
  dangerSurface: "#FEF2F2",
  success: "#059669",

  // Section badges
  badgeBg: "#EFF6FF",
  badgeText: "#1D4ED8",
} as const;

/** 4/8dp rhythm — avoids arbitrary spacing values. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: "700" },
  heading: { fontSize: 20, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  label: { fontSize: 14, fontWeight: "600" },
  caption: { fontSize: 13, fontWeight: "400" },
} as const;

/** Soft elevation — keeps cards separated from the background. */
export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;

/** Minimum tappable size (iOS 44pt / Android 48dp). */
export const TOUCH_MIN = 48;
