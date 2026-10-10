import { expect, it } from "vitest";
import { getOfficialStudyAssetUrlPattern } from "./get-official-study-asset-url-pattern.function";

it("matches local official assets including query strings", () => {
  const pattern = getOfficialStudyAssetUrlPattern("/");

  expect(pattern.test("http://localhost:5175/data/figures/garfield.png"))
    .toBe(true);

  expect(pattern.test("https://saberes.example/data/paper.PDF?version=2"))
    .toBe(true);

  expect(pattern.test("http://localhost:5175/assets/icon.png"))
    .toBe(false);
});

it("preserves the configured base and escapes regex metacharacters", () => {
  const pattern = getOfficialStudyAssetUrlPattern("/study.v2/");

  expect(pattern.test("http://localhost:5175/study.v2/data/figure.jpg"))
    .toBe(true);

  expect(pattern.test("http://localhost:5175/studyXv2/data/figure.jpg"))
    .toBe(false);

  expect(pattern.test("http://localhost:5175/data/figure.jpg"))
    .toBe(false);
});

it("survives serialization without a Vite closure", () => {
  const original = getOfficialStudyAssetUrlPattern("/");

  const serialized = new RegExp(original.source, original.flags);

  expect(serialized.test("http://localhost:5175/data/a.png"))
    .toBe(true);

  expect(serialized.test("http://localhost:5175/data/content.sqlite"))
    .toBe(false);
});
