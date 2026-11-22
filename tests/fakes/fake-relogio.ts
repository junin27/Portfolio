import type { Relogio } from "@/aplicacao/portas/relogio";

/**
 * Relógio congelado para testes: devolve sempre o mesmo instante até o teste avançar o tempo.
 *
 * @example
 * const relogio = new FakeRelogio(new Date("2026-11-22T10:00:00.000Z"));
 * relogio.avancar(60_000); // um minuto depois
 */
export class FakeRelogio implements Relogio {
  private instanteEmMilissegundos: number;

  constructor(instanteInicial: Date) {
    this.instanteEmMilissegundos = instanteInicial.getTime();
  }

  agora(): Date {
    // Cópia nova a cada chamada: quem recebe não consegue alterar o instante guardado.
    return new Date(this.instanteEmMilissegundos);
  }

  avancar(milissegundos: number): void {
    if (milissegundos < 0) {
      throw new RangeError(`avancar espera milissegundos >= 0, recebeu ${milissegundos}`);
    }
    this.instanteEmMilissegundos += milissegundos;
  }
}
