import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { QuestionStimuli } from "./question-stimuli.component";

afterEach(() => {
    cleanup();
});

describe("QuestionStimuli", () => {
    it("exibe descrição textual de estímulo visual junto à questão", () => {
        render(
            <QuestionStimuli
                contexts={[
                    {
                        id: 1,
                        title: "Descrição acessível do gráfico",
                        content: "A curva aumenta e depois estabiliza.",
                        position: 0,
                        assets: [
                            {
                                id: 10,
                                path: "official-pdfs/2027-simulation/page-images/qt-page-20.png",
                                mediaType: "image/png",
                                altText:
                                    "Página original com os gráficos de descontaminação.",
                                position: 0,
                            },
                        ],
                    },
                ]}
            />,
        );

        expect(
            screen.getByRole("region", {
                name: "Descrição acessível do gráfico",
            }),
        ).toBeTruthy();

        expect(
            screen.getByText("A curva aumenta e depois estabiliza."),
        ).toBeTruthy();
        expect(
            screen
                .getByRole("img", {
                    name: "Página original com os gráficos de descontaminação.",
                })
                .getAttribute("src"),
        ).toContain(
            "/data/official-pdfs/2027-simulation/page-images/qt-page-20.png",
        );
    });

    it("não renderiza grupo vazio", () => {
        const { container } = render(<QuestionStimuli contexts={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it("preserva as quebras de verso do estímulo", () => {
        render(
            <QuestionStimuli
                contexts={[
                    {
                        id: 2,
                        title: "Texto 2",
                        content: "Past is past.\\nWhat was\\nCannot",
                        position: 0,
                    },
                ]}
            />,
        );

        expect(screen.getByText("Past is past.\\nWhat was\\nCannot").getAttribute("style"))
            .toContain("white-space: pre-line");
    });
});
