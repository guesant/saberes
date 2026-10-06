import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { QuestionAnswerKey } from "./question-answer-key.component";

afterEach(() => {
  cleanup();
});

describe("gabarito da questão", () => {
  it("não mostra incorreção quando não há resposta a revelar", () => {
    const { container } = render(<QuestionAnswerKey answer="" />);

    expect(container.firstChild)
      .toBeNull();

    expect(screen.queryByText(/Resposta incorreta/))
      .toBeNull();
  });

  it("mostra o gabarito quando há uma resposta para revelar", () => {
    render(<QuestionAnswerKey answer="11" />);

    expect(screen.getByText("Resposta incorreta · gabarito 11"))
      .toBeTruthy();
  });
});
