import { describe, expect, it } from "vitest";
import { getQuestionContentKey } from "./get-question-content-key.function";

describe("getQuestionContentKey", () => {
  it("preserva uma chave estável baseada na ocorrência", () => {
    expect(
      getQuestionContentKey(
        { question: { occurrence_id: 42 }, options: [], parts: [], related: [], topics: [] },
        "question:old",
      ),
    )
      .toBe("question:42");
  });

  it("usa o caminho informado quando o conteúdo ainda não foi carregado", () => {
    expect(getQuestionContentKey(null, "question:42"))
      .toBe("question:42");
  });
});
