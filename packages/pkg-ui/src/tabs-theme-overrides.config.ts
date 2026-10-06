import type { Components, Theme } from "@mui/material/styles";

export const tabsThemeOverrides = {
  MuiTabs: {
    styleOverrides: {
      root: {
        maxWidth: "100%",
        minWidth: 0,
        width: "100%",
        borderBlock: "1px solid var(--mui-palette-divider)",
      },
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
        borderInlineEnd: "1px solid var(--mui-palette-divider)",
        "&:first-of-type": { borderInlineStart: "1px solid var(--mui-palette-divider)" },
      },
    },
  },
} satisfies Components<Theme>;
