import { describe, expect, it } from "vitest";
import { getPersonalReferenceSourceKind } from "./get-personal-reference-source-kind.function";

describe("getPersonalReferenceSourceKind", () => {
  it("classifica somente http e https como fontes externas", () => {
    expect(getPersonalReferenceSourceKind("https://example.com/material"))
      .toBe("external");

    expect(getPersonalReferenceSourceKind("http://example.com/material"))
      .toBe("external");
  });

  it("mantém textos, caminhos e protocolos não permitidos como fontes locais", () => {
    expect(getPersonalReferenceSourceKind("Livro de referência"))
      .toBe("local");

    expect(getPersonalReferenceSourceKind("file:///tmp/material.pdf"))
      .toBe("local");

    expect(getPersonalReferenceSourceKind("ftp://example.com/material"))
      .toBe("local");
  });
});
