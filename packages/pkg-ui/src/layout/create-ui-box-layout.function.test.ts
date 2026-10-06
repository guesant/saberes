import { expect, it } from "vitest";
import { createUiBoxLayout } from "./create-ui-box-layout.function";

it("createUiBoxLayout defaults to a padded one-column grid stack with a spacing token", () => {
  const layout = createUiBoxLayout({});

  expect(layout)
    .toMatchObject({
      dataAlign: "stretch",
      dataGap: "md",
      display: "grid",
      gridTracks: "minmax(0, 1fr)",
      flexWrap: "nowrap",
      gap: 16,
      inset: "sm",
      layoutName: "stack",
      sx: {
        alignContent: "start",
        gridAutoRows: "max-content",
        gridTemplateColumns: "minmax(0, 1fr)",
      },
    });
});

it("createUiBoxLayout keeps the vertical grid single-column despite grid options", () => {
  const layout = createUiBoxLayout({ columns: 3, layout: "column", minItemWidth: "compact" });

  expect(layout)
    .toMatchObject({ display: "grid", gridTracks: "minmax(0, 1fr)" });
});

it("createUiBoxLayout supports horizontal rows and wrapping clusters", () => {
  const row = createUiBoxLayout({ layout: "row" });

  const cluster = createUiBoxLayout({ layout: "row", wrap: true });

  expect(row)
    .toMatchObject({ dataGap: "md", flexDirection: "row", flexWrap: "nowrap", layoutName: "row" });

  expect(cluster)
    .toMatchObject({ dataGap: "sm", flexDirection: "row", flexWrap: "wrap", layoutName: "cluster" });
});

it("createUiBoxLayout uses a closed grid and responsive equal tracks", () => {
  const layout = createUiBoxLayout({ columns: 2, layout: "grid" });

  expect(layout)
    .toMatchObject({
      dataClosure: "closed",
      dataGap: "md",
      display: "grid",
      layoutName: "equal-grid",
      gridTracks: {
        md: "repeat(2, minmax(0, 1fr))",
        sm: "repeat(2, minmax(0, 1fr))",
        xs: "minmax(0, 1fr)",
      },
    });
});

it("createUiBoxLayout uses normal document flow without adding spacing or inset", () => {
  const layout = createUiBoxLayout({ layout: "flow" });

  expect(layout)
    .toMatchObject({ dataGap: "none", display: "block", gap: 0, inset: "none", layoutName: "flow" });
});

it("createUiBoxLayout preserves native display semantics for structural table elements", () => {
  const layout = createUiBoxLayout({ component: "table", layout: "native" });

  expect(layout)
    .toMatchObject({ dataGap: "none", display: undefined, gap: 0, inset: "none", layoutName: "native" });

  expect(layout.sx)
    .not.toHaveProperty("width");

  expect(layout.sx)
    .not.toHaveProperty("maxWidth");
});
