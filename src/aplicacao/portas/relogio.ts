/**
 * Porta para a hora atual. Casos de uso pedem a hora por aqui, nunca por `new Date()`,
 * para os testes poderem congelar o tempo com o `FakeRelogio`.
 *
 * @example
 * function estaVencido(prazo: Date, relogio: Relogio): boolean {
 *   return relogio.agora() > prazo;
 * }
 */
export interface Relogio {
  agora(): Date;
}
