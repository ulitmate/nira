/* AUTO-GENERATED from design/tokens/tokens.json — do not edit by hand. */
// React Native / Expo tokens. Numbers are density-independent points (dp/pt).
// Usage: const c = colors[scheme]; <View style={{ backgroundColor: c.surface, padding: space[4] }} />

export const colors = {
  "light": {
    "bg": "#F2F2F7",
    "surface": "#FFFFFF",
    "surfaceRaised": "#FFFFFF",
    "surfaceSunken": "#EBEBF0",
    "border": "#E5E5EA",
    "borderStrong": "#C7C7CC",
    "text": "#1D1D1F",
    "textMuted": "#636366",
    "textSubtle": "#6C6C70",
    "textInverse": "#FFFFFF",
    "primary": "#1D1D1F",
    "primaryHover": "#3A3A3C",
    "onPrimary": "#FFFFFF",
    "accent": "#E0185C",
    "accentFill": "#E0185C",
    "accentHover": "#C4124F",
    "accentSoft": "#FFE5EC",
    "onAccent": "#FFFFFF",
    "focus": "#E0185C",
    "success": "#1F7A36",
    "successSoft": "#E3F5E8",
    "warning": "#A64B00",
    "warningSoft": "#FFF1E0",
    "danger": "#D70015",
    "dangerSoft": "#FDE7E9",
    "info": "#1D1D1F",
    "infoSoft": "#EBEBF0",
    "phaseMenstrual": "#FF2D55",
    "phaseMenstrualSoft": "#FFE5EC",
    "phaseMenstrualInk": "#B8103F",
    "phaseFollicular": "#C7C7CC",
    "phaseFollicularSoft": "#EFEFF4",
    "phaseFollicularInk": "#48484A",
    "phaseFertile": "#FFA3B8",
    "phaseFertileSoft": "#FFF0F4",
    "phaseFertileInk": "#A3123A",
    "phaseLuteal": "#1D1D1F",
    "phaseLutealSoft": "#E5E5EA",
    "phaseLutealInk": "#1D1D1F",
    "ai": "#1D1D1F",
    "aiSoft": "#E9E9EB",
    "glass": "rgba(255, 255, 255, 0.72)",
    "glassStrong": "rgba(255, 255, 255, 0.82)",
    "glassStroke": "rgba(255, 255, 255, 0.90)",
    "glassEdge": "rgba(0, 0, 0, 0.06)",
    "glassSheen": "rgba(255, 255, 255, 1)",
    "glassFill": "rgba(118, 118, 128, 0.10)",
    "scrim": "rgba(0, 0, 0, 0.30)"
  },
  "dark": {
    "bg": "#000000",
    "surface": "#1C1C1E",
    "surfaceRaised": "#2C2C2E",
    "surfaceSunken": "#2C2C2E",
    "border": "#2C2C2E",
    "borderStrong": "#48484A",
    "text": "#F5F5F7",
    "textMuted": "#A1A1A6",
    "textSubtle": "#8E8E93",
    "textInverse": "#1D1D1F",
    "primary": "#F5F5F7",
    "primaryHover": "#FFFFFF",
    "onPrimary": "#000000",
    "accent": "#FF5C8A",
    "accentFill": "#E0185C",
    "accentHover": "#F0306E",
    "accentSoft": "#3A0F1C",
    "onAccent": "#FFFFFF",
    "focus": "#FF5C8A",
    "success": "#30D158",
    "successSoft": "#0F2E18",
    "warning": "#FFB340",
    "warningSoft": "#3A2808",
    "danger": "#FF6961",
    "dangerSoft": "#3D1412",
    "info": "#F5F5F7",
    "infoSoft": "#2C2C2E",
    "phaseMenstrual": "#FF375F",
    "phaseMenstrualSoft": "#3A0F1C",
    "phaseMenstrualInk": "#FF8FA8",
    "phaseFollicular": "#636366",
    "phaseFollicularSoft": "#2C2C2E",
    "phaseFollicularInk": "#D1D1D6",
    "phaseFertile": "#FFB3C4",
    "phaseFertileSoft": "#33161E",
    "phaseFertileInk": "#FFC2D0",
    "phaseLuteal": "#F5F5F7",
    "phaseLutealSoft": "#3A3A3C",
    "phaseLutealInk": "#F5F5F7",
    "ai": "#F5F5F7",
    "aiSoft": "#2C2C2E",
    "glass": "rgba(28, 28, 30, 0.72)",
    "glassStrong": "rgba(44, 44, 46, 0.80)",
    "glassStroke": "rgba(255, 255, 255, 0.10)",
    "glassEdge": "rgba(0, 0, 0, 0.60)",
    "glassSheen": "rgba(255, 255, 255, 0.14)",
    "glassFill": "rgba(118, 118, 128, 0.22)",
    "scrim": "rgba(0, 0, 0, 0.60)"
  }
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof typeof colors.light;

/** iOS: use the system font (SF Pro) via fontFamily "System" — never bundle SF. Android: bundle Inter. */
export const fontFamily = {
  "ios": {
    "display": "System",
    "ui": "System",
    "rounded": "System (design: rounded)",
    "mono": "Menlo"
  },
  "android": {
    "display": "Inter-Display",
    "ui": "Inter",
    "rounded": "Inter-Display",
    "mono": "monospace"
  }
} as const;

/** "family" is a key of fontFamily[Platform.OS]. letterSpacing is in points (tracking × size). */
export const type = {
  "hero": {
    "family": "rounded",
    "fontSize": 96,
    "lineHeight": 96,
    "fontWeight": "700",
    "letterSpacing": -4.32
  },
  "display": {
    "family": "display",
    "fontSize": 48,
    "lineHeight": 52,
    "fontWeight": "700",
    "letterSpacing": -1.68
  },
  "largeTitle": {
    "family": "display",
    "fontSize": 34,
    "lineHeight": 41,
    "fontWeight": "700",
    "letterSpacing": -0.85
  },
  "title1": {
    "family": "display",
    "fontSize": 28,
    "lineHeight": 34,
    "fontWeight": "700",
    "letterSpacing": -0.56
  },
  "title2": {
    "family": "display",
    "fontSize": 22,
    "lineHeight": 28,
    "fontWeight": "700",
    "letterSpacing": -0.33
  },
  "title3": {
    "family": "ui",
    "fontSize": 20,
    "lineHeight": 25,
    "fontWeight": "600",
    "letterSpacing": -0.2
  },
  "headline": {
    "family": "ui",
    "fontSize": 17,
    "lineHeight": 22,
    "fontWeight": "600",
    "letterSpacing": -0.17
  },
  "body": {
    "family": "ui",
    "fontSize": 17,
    "lineHeight": 24,
    "fontWeight": "400",
    "letterSpacing": -0.17
  },
  "callout": {
    "family": "ui",
    "fontSize": 16,
    "lineHeight": 21,
    "fontWeight": "400",
    "letterSpacing": -0.08
  },
  "subhead": {
    "family": "ui",
    "fontSize": 15,
    "lineHeight": 20,
    "fontWeight": "400",
    "letterSpacing": -0.07
  },
  "footnote": {
    "family": "ui",
    "fontSize": 13,
    "lineHeight": 18,
    "fontWeight": "400",
    "letterSpacing": 0
  },
  "caption": {
    "family": "ui",
    "fontSize": 12,
    "lineHeight": 16,
    "fontWeight": "500",
    "letterSpacing": 0
  },
  "overline": {
    "family": "ui",
    "fontSize": 12,
    "lineHeight": 16,
    "fontWeight": "600",
    "letterSpacing": 0.72
  }
} as const;

export const space = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64,
  "20": 80,
  "px": 1,
  "05": 2
} as const;
export const radius = {
  "xs": 8,
  "sm": 12,
  "md": 18,
  "lg": 28,
  "xl": 36,
  "pill": 999
} as const;
/** Blur radii for expo-blur / @react-native-community/blur (intensity ≈ radius). */
export const blur = {
  "glass": 28,
  "glassStrong": 40
} as const;
export const size = {
  "touchMin": 44,
  "touchComfortable": 48,
  "iconSm": 16,
  "icon": 20,
  "iconLg": 24,
  "sidebar": 264,
  "contentMax": 1200,
  "tabbarHeight": 64
} as const;
export const duration = {
  "instant": 90,
  "fast": 160,
  "base": 280,
  "slow": 520
} as const;
/** Reanimated withSpring config — the default Nira spring. */
export const spring = {
  "damping": 18,
  "stiffness": 220,
  "mass": 1
} as const;
/** Bezier control points for Reanimated's Easing.bezier(...). */
export const easing = {
  "standard": [
    0.2,
    0,
    0,
    1
  ],
  "spring": [
    0.34,
    1.4,
    0.64,
    1
  ],
  "exit": [
    0.4,
    0,
    1,
    1
  ]
} as const;

export const phases = ["menstrual", "follicular", "fertile", "luteal"] as const;
export type Phase = (typeof phases)[number];
