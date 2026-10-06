import { UIAutocomplete } from "@guesant/saberes-ui";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

describe("seletor de conteúdo relacionado", () => {
  it("permite pesquisar e escolher uma referência pelo nome", async () => {
    const onChange = vi.fn();

    render(
      <UIAutocomplete
        label="Conteúdo relacionado"
        onChange={onChange}
        options={[
          { label: "Tópico · Funções e gráficos", value: "topic:functions" },
          { label: "Questão · Função afim", value: "question:42" },
        ]}
        value=""
      />,
    );

    const input = screen.getByRole("combobox", { name: "Conteúdo relacionado" });

    fireEvent.change(input, { target: { value: "Funções" } });

    const option = await screen.findByRole("option", { name: "Tópico · Funções e gráficos" });

    fireEvent.click(option);

    expect(onChange)
      .toHaveBeenCalledWith("topic:functions");
  });
});
