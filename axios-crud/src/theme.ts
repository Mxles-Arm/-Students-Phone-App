/**
 * Semantic design tokens.
 * Screens should reference these instead of hardcoding hex values,
 * so colour/spacing decisions stay in one place.
 */
import { useThemeMode } from "./theme-context";

export type ThemeColors = {
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfacePressed: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
  dangerSurface: string;
  success: string;
  /** Neutral badge — used by the avatar initials circle, not the section tag. */
  badgeBg: string;
  badgeText: string;
};

export type SectionBadgeColors = { bg: string; text: string };

/**
 * Per-section badge colors, keyed by the exact section values used across
 * the app (form-controls.tsx SECTIONS). Distinct from `danger` so a section
 * tag is never mistaken for a destructive/warning indicator.
 */
export type SectionPalette = Record<"CED" | "TCT", SectionBadgeColors> & {
  /** Fallback for any section value outside the known set. */
  fallback: SectionBadgeColors;
};

const lightColors: ThemeColors = {
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

  // Section badges (avatar only — see SectionPalette for section tags)
  badgeBg: "#EFF6FF",
  badgeText: "#1D4ED8",
};

const lightSectionPalette: SectionPalette = {
  CED: { bg: "#DCFCE7", text: "#15803D" },
  TCT: { bg: "#FEF3C7", text: "#B45309" },
  fallback: { bg: "#EFF6FF", text: "#1D4ED8" },
};

const darkColors: ThemeColors = {
  // Brand
  primary: "#60A5FA",
  primaryPressed: "#3B82F6",
  onPrimary: "#0B1220",

  // Surfaces
  background: "#0B1220",
  surface: "#151E2E",
  surfacePressed: "#1C293D",

  // Text
  text: "#F1F5F9",
  textMuted: "#94A3B8",

  // Lines
  border: "#243247",

  // Status
  danger: "#F87171",
  dangerSurface: "#3B1D1D",
  success: "#34D399",

  // Section badges (avatar only — see SectionPalette for section tags)
  badgeBg: "#1E293B",
  badgeText: "#93C5FD",
};

const darkSectionPalette: SectionPalette = {
  CED: { bg: "#14532D", text: "#86EFAC" },
  TCT: { bg: "#78350F", text: "#FCD34D" },
  fallback: { bg: "#1E293B", text: "#93C5FD" },
};

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

/** Looks up section badge colors, falling back gracefully for unknown values. */
function resolveSectionColors(palette: SectionPalette, section: string): SectionBadgeColors {
  return section === "CED" || section === "TCT" ? palette[section] : palette.fallback;
}

/**
 * Resolves the active palette from the user's chosen theme (light/dark toggle
 * in the app, persisted via ThemeModeProvider) — not the OS setting directly.
 */
export function useTheme(): {
  colors: ThemeColors;
  scheme: "light" | "dark";
  getSectionColors: (section: string) => SectionBadgeColors;
} {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const colors = isDark ? darkColors : lightColors;
  const sectionPalette = isDark ? darkSectionPalette : lightSectionPalette;

  return {
    colors,
    scheme: mode,
    getSectionColors: (section: string) => resolveSectionColors(sectionPalette, section),
  };
}
