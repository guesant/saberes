// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { QuestionConsultationAnswerKey } from "./question-consultation-answer-key.component";

afterEach(cleanup);

it("shows the key without inventing an incorrect attempt", () => {
  render(<QuestionConsultationAnswerKey answer="B" />);
  expect(screen.getByText("Gabarito cadastrado: B"))
    .toBeTruthy();
  expect(screen.queryByText(/Resposta incorreta/))
    .toBeNull();
});

it("does not fabricate a missing answer", () => {
  const { container } = render(<QuestionConsultationAnswerKey />);
  expect(container.firstChild)
    .toBeNull();
});
