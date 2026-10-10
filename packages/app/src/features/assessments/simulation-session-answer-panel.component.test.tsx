// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimulationSessionAnswerPanel } from "./simulation-session-answer-panel.component";

vi.mock("@guesant/saberes-ui", () => ({
  UIAlert: (props: { children: string }) => <div role="note">{props.children}</div>,
  UISimulationAnswerInput: () => <input aria-label="resposta" />,
}));
vi.mock("@guesant/saberes-ui-content", () => ({
  UIQuestionRichText: () => <div>enunciado</div>,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(() => cleanup());

describe("SimulationSessionAnswerPanel", () => {
  const viewModel = {
    session: null,
    question: null,
    questionKey: "question:cancelled",
    loading: false,
    busy: false,
    finishing: false,
    expired: false,
    remainingSeconds: 100,
    answer: "A",
    error: null,
    contentError: null,
    confirmed: false,
    changeAnswer: vi.fn(),
    retryAnswer: vi.fn(async () => undefined),
    toggleFlag: vi.fn(async () => undefined),
    navigate: vi.fn(async () => undefined),
    requestFinish: vi.fn(),
    cancelFinish: vi.fn(),
    finish: vi.fn(async () => undefined),
    reload: vi.fn(async () => undefined),
  };

  it("shows no response control for an officially cancelled question", () => {
    render(<SimulationSessionAnswerPanel
      viewModel={viewModel}
      question={{ question: { answer_status: "cancelled", statement: "texto", type: "single_choice" }, options: [], parts: [], topics: [], related: [] }}
    />);

    expect(screen.queryByRole("textbox", { name: "resposta" })).toBeNull();
    expect(screen.getByRole("note").textContent).toBe("simulator.cancelledQuestion");
  });

  it("keeps the response control for an answerable question", () => {
    render(<SimulationSessionAnswerPanel
      viewModel={viewModel}
      question={{ question: { answer_status: "definitive", statement: "texto", type: "single_choice" }, options: [], parts: [], topics: [], related: [] }}
    />);

    expect(screen.getByRole("textbox", { name: "resposta" })).toBeTruthy();
  });
});
