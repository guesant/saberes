import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UIPdfPageDialog } from "./pdf-page-dialog.component";

const pdfjs = vi.hoisted(() => {return {
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(),
};});

vi.mock("pdfjs-dist", () => {return pdfjs;});

afterEach(() => {
  cleanup();

  vi.restoreAllMocks();
});

describe("UIPdfPageDialog", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => {return 800;},
    });

    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: () => {return 700;},
    });

    vi.spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue({} as CanvasRenderingContext2D);

    const page = {
      getViewport: ({ scale }: { scale: number }) => {return { width: 600 * scale, height: 800 * scale };},
      render: vi.fn(() => {return { promise: Promise.resolve(), cancel: vi.fn() };}),
    };

    const document = {
      numPages: 2,
      getPage: vi.fn(async () => {return page;}),
    };

    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve(document),
      destroy: vi.fn(),
    });
  });

  it("loads the local PDF in full for offline caching and offers page and zoom controls", async () => {
    render(
      <UIPdfPageDialog
        onClose={vi.fn()}
        open
        page={1}
        src="/data/official-pdfs/2026/QX.pdf"
        title="2026 · QX · página 9"
      />,
    );

    expect(getComputedStyle(document.querySelector(".MuiDialogContent-root") as HTMLElement).display)
      .toBe("flex");

    await waitFor(() => {return expect(screen.getByLabelText("Página 1 do documento 2026 · QX · página 9"))
      .toBeTruthy();});

    await waitFor(() => {
      expect((screen.getByLabelText("Página 1 do documento 2026 · QX · página 9") as HTMLCanvasElement).width)
        .toBeGreaterThan(300);
    });

    expect(screen.queryByLabelText("Carregando PDF"))
      .toBeNull();

    const initialCanvasWidth = (screen.getByLabelText("Página 1 do documento 2026 · QX · página 9") as HTMLCanvasElement).width;

    expect(pdfjs.getDocument)
      .toHaveBeenCalledWith({
        url: "/data/official-pdfs/2026/QX.pdf",
        disableRange: true,
        disableStream: true,
      });

    fireEvent.click(screen.getByRole("button", { name: "Aumentar zoom" }));

    await waitFor(() => {return expect(screen.getByText("120%"))
      .toBeTruthy();});

    await waitFor(() => {
      expect((screen.getByLabelText("Página 1 do documento 2026 · QX · página 9") as HTMLCanvasElement).width)
        .toBeGreaterThan(initialCanvasWidth);
    });

    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {return expect(screen.getByLabelText("Página 2 do documento 2026 · QX · página 9"))
      .toBeTruthy();});
  });
});
