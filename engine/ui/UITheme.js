/**
 * Centralized UI Theme and Styling System
 * Provides consistent colors, sizes, and styles across all UI elements
 */
export const UITheme = {
  // Button styles
  button: {
    default: {
      bgColor: "rgba(255,255,255,0.15)",
      borderColor: "rgba(255,255,255,0.3)",
      textColor: "#fff",
      borderWidth: 2,
      fontSize: 18,
      fontWeight: "bold",
      radius: 10,
      padding: 12,
    },
    primary: {
      bgColor: "rgba(99,102,241,0.8)",
      borderColor: "rgba(99,102,241,1)",
      textColor: "#fff",
      borderWidth: 2,
      fontSize: 20,
      fontWeight: "bold",
      radius: 10,
      padding: 16,
    },
    secondary: {
      bgColor: "rgba(139,92,246,0.6)",
      borderColor: "rgba(139,92,246,1)",
      textColor: "#fff",
      borderWidth: 1,
      fontSize: 14,
      fontWeight: "bold",
      radius: 8,
      padding: 8,
    },
    success: {
      bgColor: "rgba(34,197,94,0.7)",
      borderColor: "rgba(34,197,94,1)",
      textColor: "#fff",
      borderWidth: 2,
      fontSize: 18,
      fontWeight: "bold",
      radius: 10,
      padding: 12,
    },
    danger: {
      bgColor: "rgba(239,68,68,0.7)",
      borderColor: "rgba(239,68,68,1)",
      textColor: "#fff",
      borderWidth: 2,
      fontSize: 18,
      fontWeight: "bold",
      radius: 10,
      padding: 12,
    },
  },

  // Text styles
  text: {
    title: {
      fontSize: 40,
      fontWeight: "bold",
      textColor: "#fff",
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      textColor: "#fff",
    },
    body: {
      fontSize: 16,
      fontWeight: "normal",
      textColor: "rgba(255,255,255,0.9)",
    },
    small: {
      fontSize: 13,
      fontWeight: "normal",
      textColor: "rgba(255,255,255,0.7)",
    },
  },

  // Layout/Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Hover/Active states
  states: {
    hover: { opacity: 0.8, scale: 1.05 },
    pressed: { opacity: 0.9, scale: 0.95 },
    disabled: { opacity: 0.5, scale: 1.0 },
  },

  // Colors
  colors: {
    primary: "rgba(99,102,241,0.8)",
    secondary: "rgba(139,92,246,0.6)",
    success: "rgba(34,197,94,0.7)",
    danger: "rgba(239,68,68,0.7)",
    warning: "rgba(251,146,60,0.7)",
    info: "rgba(59,130,246,0.7)",
    background: "rgba(15,15,25,0.95)",
    surface: "rgba(25,25,40,0.9)",
    text: "#fff",
    textMuted: "rgba(255,255,255,0.6)",
  },
};
