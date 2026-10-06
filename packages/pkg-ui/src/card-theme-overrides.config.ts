import type { Components, Theme } from "@mui/material/styles";

export const cardThemeOverrides = {
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: "var(--mui-palette-action-hover)",
        border: "1px solid var(--mui-palette-divider)",
        borderRadius: "0.25rem",
        boxShadow: "none",
        boxSizing: "border-box",
        maxWidth: "100%",
        minWidth: 0,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { padding: 16, "&:last-child": { paddingBottom: 16 } },
    },
  },
} satisfies Components<Theme>;
