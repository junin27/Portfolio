import { render, screen } from "@testing-library/react";
import PaginaInicial from "./page";

describe("PaginaInicial", () => {
  it("mostra o título provisório do portfólio", () => {
    render(<PaginaInicial />);

    expect(screen.getByRole("heading", { level: 1, name: "Portfólio em construção" })).toBeInTheDocument();
  });
});
