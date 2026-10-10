import { afterEach, expect, it, vi } from "vitest";
import { downloadOfficialStudyAssets } from "./download-official-study-assets.function";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("downloads and caches every PDF in the manifest, prioritizing the latest editions", async () => {
  const manifest = [
    { appUrlSuffix: "data/official-pdfs/2026/QX.pdf", bytes: 20, mediaType: "application/pdf", path: "official-pdfs/2026/QX.pdf" },
    { appUrlSuffix: "data/official-pdfs/2027-simulation/QT.pdf", bytes: 30, mediaType: "application/pdf", path: "official-pdfs/2027-simulation/QT.pdf" },
  ].map((asset) => {return JSON.stringify(asset);})
    .join("\n");

  const cachedUrls: string[] = [];

  const cache = {
    match: vi.fn(async () => {return undefined;}),
    put: vi.fn(async (url: string) => {cachedUrls.push(url);}),
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    if (String(input)
      .includes("asset-manifest.jsonl")) {
      return { ok: true, status: 200, text: async () => {return manifest;} } as Response;
    }

    return { ok: true, status: 200 } as Response;
  });

  vi.stubGlobal("caches", { open: vi.fn(async () => {return cache;}) });

  vi.stubGlobal("fetch", fetchMock);

  const progress = await downloadOfficialStudyAssets(new AbortController().signal, vi.fn());

  expect(progress)
    .toMatchObject({ completedAssets: 2, completedBytes: 50, failedAssets: 0, totalAssets: 2, totalBytes: 50 });

  expect(cachedUrls[0])
    .toContain("2027-simulation/QT.pdf");

  expect(cachedUrls[1])
    .toContain("2026/QX.pdf");
});

it("reuses PDFs already cached on this device when resuming the download", async () => {
  const manifest = JSON.stringify({
    appUrlSuffix: "data/official-pdfs/2026/QX.pdf",
    bytes: 20,
    mediaType: "application/pdf",
    path: "official-pdfs/2026/QX.pdf",
  });

  const cache = {
    match: vi.fn(async () => {return new Response("cached PDF");}),
    put: vi.fn(async () => {}),
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    if (String(input)
      .includes("asset-manifest.jsonl")) {
      return { ok: true, status: 200, text: async () => {return manifest;} } as Response;
    }

    return { ok: true, status: 200 } as Response;
  });

  vi.stubGlobal("caches", { open: vi.fn(async () => {return cache;}) });

  vi.stubGlobal("fetch", fetchMock);

  const progress = await downloadOfficialStudyAssets(new AbortController().signal, vi.fn());

  expect(progress)
    .toMatchObject({ completedAssets: 1, completedBytes: 20, failedAssets: 0, totalAssets: 1 });

  expect(fetchMock)
    .toHaveBeenCalledTimes(1);

  expect(cache.put)
    .not.toHaveBeenCalled();

  expect(cache.match)
    .toHaveBeenCalledWith(expect.stringContaining("QX.pdf"));
});
