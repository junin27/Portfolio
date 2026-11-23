import type { ConsultaDeRepositorio } from "../../scripts/hooks/caminhos-do-projeto";

interface Checkout {
  readonly topo: string;
  readonly gitComum: string;
}

/** Repositórios em memória: cada checkout (principal ou worktree) declara seu topo e sua pasta .git comum. */
export class FakeConsultaDeRepositorio implements ConsultaDeRepositorio {
  private readonly checkouts: Checkout[] = [];

  comCheckout(topo: string, gitComum: string): this {
    this.checkouts.push({ topo, gitComum });
    return this;
  }

  topo(pasta: string): string | null {
    return this.checkoutQueContem(pasta)?.topo ?? null;
  }

  gitComum(pasta: string): string | null {
    return this.checkoutQueContem(pasta)?.gitComum ?? null;
  }

  // O checkout mais profundo vence: um worktree dentro de .claude/worktrees também está "dentro" do principal.
  private checkoutQueContem(pasta: string): Checkout | undefined {
    return this.checkouts
      .filter((checkout) => pasta === checkout.topo || pasta.startsWith(`${checkout.topo}/`))
      .sort((a, b) => b.topo.length - a.topo.length)[0];
  }
}
