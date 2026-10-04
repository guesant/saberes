import { createTheme } from "@guesant/saberes-ui";

export const theme = createTheme({
  palette: {
    primary: { main: "#152a4a", contrastText: "#fff" },
    secondary: { main: "#e59b2f" },
    background: { default: "#f7f8fb", paper: "#fff" },
    success: { main: "#2e7d5b" },
  },
  typography: {
    fontFamily: "Roboto Slab, Georgia, serif",
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e5e8ef",
          boxShadow: "0 8px 28px rgba(21,42,74,.06)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: { root: { borderRadius: "0.25rem" } },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiIconButton: { defaultProps: { disableRipple: true } },
    MuiListItemButton: { defaultProps: { disableRipple: true } },
    MuiStepButton: { defaultProps: { disableRipple: true } },
    MuiTab: { defaultProps: { disableRipple: true } },
  },
});
