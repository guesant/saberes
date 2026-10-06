import type { Components, Theme } from "@mui/material/styles";

export const tabsThemeOverrides = {
  MuiTabs: {
    styleOverrides: {
      root: { maxWidth: "100%", minWidth: 0, width: "100%" },
      flexContainer: { flexWrap: "nowrap" },
      scroller: { scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } },
    },
  },
  MuiTab: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        flexShrink: 0,
        maxWidth: "none",
        minHeight: 48,
        whiteSpace: "nowrap",
      },
    },
  },
} satisfies Components<Theme>;
