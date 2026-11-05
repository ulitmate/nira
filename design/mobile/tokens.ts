/* AUTO-GENERATED from design/tokens/tokens.json — do not edit by hand. */
// React Native / Expo tokens. Numbers are density-independent points (dp/pt).
// Usage: const c = colors[scheme]; <View style={{ backgroundColor: c.surface, padding: space[4] }} />

export const colors = {
  "light": {
    "bg": "#F5F5F7",
    "surface": "#FFFFFF",
    "surfaceRaised": "#FFFFFF",
    "surfaceSunken": "#EEEEF2",
    "border": "#E3E3E8",
    "borderStrong": "#C7C7CC",
    "text": "#1D1D1F",
    "textMuted": "#636368",
    "textSubtle": "#6E6E73",
    "textInverse": "#FFFFFF",
    "primary": "#1D1D1F",
    "primaryHover": "#3A3A3C",
    "onPrimary": "#FFFFFF",
    "accent": "#E11D48",
    "accentHover": "#BE123C",
    "accentSoft": "#FFE4EA",
    "onAccent": "#FFFFFF",
    "brandFrom": "#E11D48",
    "brandTo": "#7C3AED",
    "onBrand": "#FFFFFF",
    "focus": "#0071E3",
    "success": "#1F7A36",
    "successSoft": "#E3F5E8",
    "warning": "#A64B00",
    "warningSoft": "#FFF1E0",
    "danger": "#D70015",
    "dangerSoft": "#FDE7E9",
    "info": "#0066CC",
    "infoSoft": "#E5F1FD",
    "phaseMenstrual": "#FF375F",
    "phaseMenstrualSoft": "#FFE4EA",
    "phaseMenstrualInk": "#B80F37",
    "phaseFollicular": "#00B8A9",
    "phaseFollicularSoft": "#DDF6F3",
    "phaseFollicularInk": "#00695F",
    "phaseFertile": "#FF9F0A",
    "phaseFertileSoft": "#FFF0D9",
    "phaseFertileInk": "#8F4F00",
    "phaseLuteal": "#8E5CF7",
    "phaseLutealSoft": "#EFE8FF",
    "phaseLutealInk": "#5B2BC9",
    "ai": "#5B2BC9",
    "aiSoft": "#EFE8FF",
    "glass": "rgba(255, 255, 255, 0.58)",
    "glassStrong": "rgba(255, 255, 255, 0.80)",
    "glassStroke": "rgba(255, 255, 255, 0.85)",
    "glassEdge": "rgba(0, 0, 0, 0.06)",
    "glassSheen": "rgba(255, 255, 255, 0.95)",
    "glassFill": "rgba(118, 118, 128, 0.10)",
    "auraStrength": "0.38",
    "scrim": "rgba(0, 0, 0, 0.30)"
  },
  "dark": {
    "bg": "#050507",
    "surface": "#1C1C1E",
    "surfaceRaised": "#2C2C2E",
    "surfaceSunken": "#2A2A2E",
    "border": "#2C2C30",
    "borderStrong": "#48484A",
    "text": "#F5F5F7",
    "textMuted": "#A1A1A6",
    "textSubtle": "#8E8E93",
    "textInverse": "#1D1D1F",
    "primary": "#F5F5F7",
    "primaryHover": "#FFFFFF",
    "onPrimary": "#000000",
    "accent": "#FF4D6D",
    "accentHover": "#FF6B85",
    "accentSoft": "#3D0F1A",
    "onAccent": "#000000",
    "brandFrom": "#E11D48",
    "brandTo": "#7C3AED",
    "onBrand": "#FFFFFF",
    "focus": "#409CFF",
    "success": "#30D158",
    "successSoft": "#0F2E18",
    "warning": "#FFB340",
    "warningSoft": "#3A2808",
    "danger": "#FF6961",
    "dangerSoft": "#3D1412",
    "info": "#64B5FF",
    "infoSoft": "#0D2540",
    "phaseMenstrual": "#FF4D6D",
    "phaseMenstrualSoft": "#3D0F1A",
    "phaseMenstrualInk": "#FF9AAE",
    "phaseFollicular": "#30D5C8",
    "phaseFollicularSoft": "#08302D",
    "phaseFollicularInk": "#7EEBE2",
    "phaseFertile": "#FFB340",
    "phaseFertileSoft": "#3A2808",
    "phaseFertileInk": "#FFD28A",
    "phaseLuteal": "#A78BFA",
    "phaseLutealSoft": "#2A1D52",
    "phaseLutealInk": "#CDBEFF",
    "ai": "#C4B0FF",
    "aiSoft": "#241A45",
    "glass": "rgba(28, 28, 32, 0.52)",
    "glassStrong": "rgba(38, 38, 42, 0.78)",
    "glassStroke": "rgba(255, 255, 255, 0.10)",
    "glassEdge": "rgba(0, 0, 0, 0.50)",
    "glassSheen": "rgba(255, 255, 255, 0.16)",
    "glassFill": "rgba(118, 118, 128, 0.20)",
    "auraStrength": "0.42",
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
  "glassStrong": 40,
  "aura": 90
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
  "slow": 520,
  "ambient": 28000
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
