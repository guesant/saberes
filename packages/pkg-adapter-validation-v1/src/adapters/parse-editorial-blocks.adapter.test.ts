import { describe, expect, it } from "vitest";
import { ValibotParseEditorialBlocksAdapter } from "./parse-editorial-blocks.adapter";

describe("ValibotParseEditorialBlocksAdapter", () => {
  it("parses valid editorial blocks", async () => {
    const adapter = new ValibotParseEditorialBlocksAdapter();

    const result = await adapter.execute({
      blocksJson: JSON.stringify([{ type: "summary", content: "Resumo" }]),
    });

    expect(result)
      .toEqual({
        status: "valid",
        blocks: [{ type: "summary", content: "Resumo" }],
      });
  });

  it("returns a local validation result for invalid JSON", async () => {
    const adapter = new ValibotParseEditorialBlocksAdapter();

    const result = await adapter.execute({ blocksJson: "{" });

    expect(result.status)
      .toBe("invalid");
  });

  it("rejects unsupported block types", async () => {
    const adapter = new ValibotParseEditorialBlocksAdapter();

    const result = await adapter.execute({
      blocksJson: JSON.stringify([{ type: "script", content: "alert(1)" }]),
    });

    expect(result.status)
      .toBe("invalid");
  });

  it("rejects remote images and executable editorial content", async () => {
    const adapter = new ValibotParseEditorialBlocksAdapter();

    const result = await adapter.execute({
      blocksJson: JSON.stringify([
        { type: "image", src: "https://example.com/image.png", alt: "Imagem" },
        { type: "callout", content: "<script>alert(1)</script>" },
      ]),
    });

    expect(result.status)
      .toBe("invalid");
  });

  it("accepts local images and controlled video providers", async () => {
    const adapter = new ValibotParseEditorialBlocksAdapter();

    const result = await adapter.execute({
      blocksJson: JSON.stringify([
        { type: "image", src: "/images/example.png", alt: "Imagem" },
        { type: "video", url: "https://www.youtube.com/embed/example" },
      ]),
    });

    expect(result.status)
      .toBe("valid");
  });
});
