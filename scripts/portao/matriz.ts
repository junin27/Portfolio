import type { Verificacao } from "./tipos";

// Espelho executável da matriz de docs/estrategia-de-testes.md. Ao ativar uma verificação numa
// change, troque o comando null pelo comando real (o teste da matriz reprova automática ativa sem comando).

function automatica(
  id: string,
  nome: string,
  criterio: string,
  ativa: number,
  comando: string[] | null,
): Verificacao {
  return { id, nome, tipo: "automatica", criterio, ativaDesdeAChange: ativa, comando };
}

function revisao(id: string, nome: string, criterio: string, ativa: number): Verificacao {
  return {
    id,
    nome,
    tipo: "revisao-externa",
    criterio,
    ativaDesdeAChange: ativa,
    comando: null,
    arquivoDoRelatorio: `revisoes/${id}.md`,
  };
}

// Números das changes do roadmap (docs/roadmap.md) a partir das quais cada verificação vale.
const CHANGE = {
  HARNESS: 0,
  DOMINIO_E_PORTAS: 1,
  DESIGN_SYSTEM: 2,
  HOME_PUBLICA: 3,
  PERSISTENCIA: 7,
  LOGIN: 8,
  DRIVE: 9,
  DEPLOY: 10,
} as const;

const ZERO_ERROS = "zero erros";
const TODOS_PASSANDO = "100% passando";
const ZERO_PENDENTES = "zero achados confirmados pendentes";

export const MATRIZ_DE_VERIFICACOES: readonly Verificacao[] = [
  automatica("lint", "Lint", ZERO_ERROS, CHANGE.HARNESS, ["pnpm", "lint"]),
  automatica("formatacao", "Formatação", ZERO_ERROS, CHANGE.HARNESS, ["pnpm", "format:check"]),
  automatica("tipos", "Tipos", ZERO_ERROS, CHANGE.HARNESS, ["pnpm", "typecheck"]),
  automatica("arquitetura", "Arquitetura (camadas e ciclos)", "zero violações", CHANGE.HARNESS, [
    "pnpm",
    "arquitetura",
  ]),
  automatica("codigo-morto", "Código morto", "zero itens", CHANGE.HARNESS, ["pnpm", "codigo-morto"]),
  automatica("unitarios", "Unitários e componentes", TODOS_PASSANDO, CHANGE.HARNESS, ["pnpm", "test"]),
  automatica("integracao", "Integração", TODOS_PASSANDO, CHANGE.HARNESS, ["pnpm", "test:integracao"]),
  automatica("e2e", "Ponta a ponta (3 motores)", TODOS_PASSANDO, CHANGE.HARNESS, ["pnpm", "test:e2e:todos"]),
  automatica("build", "Build", "sem erro", CHANGE.HARNESS, ["pnpm", "build"]),
  automatica("dependencias", "Dependências vulneráveis", "zero altas e críticas", CHANGE.HARNESS, [
    "pnpm",
    "audit",
    "--audit-level",
    "high",
  ]),
  automatica("segredos", "Segredos vazados (gitleaks)", "zero achados", CHANGE.HARNESS, ["pnpm", "segredos"]),
  automatica("specs", "Validação do OpenSpec", "válido", CHANGE.HARNESS, ["pnpm", "specs"]),
  {
    id: "codeql",
    nome: "CodeQL",
    tipo: "somente-ci",
    criterio: "zero alertas",
    ativaDesdeAChange: CHANGE.HARNESS,
    comando: null,
  },
  revisao("mantis", "Mantis (segurança)", ZERO_PENDENTES, CHANGE.HARNESS),
  revisao(
    "skillspector",
    "SkillSpector (.claude/)",
    "nota ≤ 20 e nenhum achado confirmado pendente",
    CHANGE.HARNESS,
  ),
  revisao(
    "ponytail-review",
    "Revisão de qualidade (ponytail)",
    'zero "Must fix" e "Should fix" pendentes',
    CHANGE.HARNESS,
  ),
  automatica("contrato-das-portas", "Contrato das portas", TODOS_PASSANDO, CHANGE.DOMINIO_E_PORTAS, null),
  automatica("cobertura", "Cobertura", "≥ 90% em dominio e aplicacao", CHANGE.DOMINIO_E_PORTAS, null),
  automatica("propriedades", "Propriedades (fast-check)", TODOS_PASSANDO, CHANGE.DOMINIO_E_PORTAS, null),
  automatica("mutacao", "Mutação (Stryker)", "≥ 80% em dominio", CHANGE.DOMINIO_E_PORTAS, null),
  automatica("idempotencia", "Idempotência", TODOS_PASSANDO, CHANGE.DOMINIO_E_PORTAS, null),
  revisao("impeccable-detect", "Qualidade de design (impeccable)", ZERO_PENDENTES, CHANGE.DESIGN_SYSTEM),
  revisao("impeccable-critique", "Revisão de design (impeccable)", ZERO_PENDENTES, CHANGE.DESIGN_SYSTEM),
  automatica("acessibilidade", "Acessibilidade (axe)", "zero violações", CHANGE.DESIGN_SYSTEM, null),
  automatica(
    "regressao-visual",
    "Regressão visual",
    "zero diferenças fora da tolerância",
    CHANGE.DESIGN_SYSTEM,
    null,
  ),
  automatica(
    "movimento-reduzido",
    "Movimento reduzido",
    "nenhuma animação ativa",
    CHANGE.DESIGN_SYSTEM,
    null,
  ),
  automatica("teclado", "Teclado e foco", "todos os controles alcançáveis", CHANGE.DESIGN_SYSTEM, null),
  automatica("responsividade", "Responsividade", "sem rolagem horizontal", CHANGE.DESIGN_SYSTEM, null),
  automatica("animacao", "Animação", "estados inicial e final corretos", CHANGE.DESIGN_SYSTEM, null),
  automatica("hidratacao", "Hidratação", "zero erros de hidratação", CHANGE.HOME_PUBLICA, null),
  automatica(
    "lighthouse",
    "Lighthouse",
    "A11y, Boas práticas e SEO = 100; Desempenho ≥ 90",
    CHANGE.HOME_PUBLICA,
    null,
  ),
  automatica("bundle", "Tamanho do bundle", "dentro do orçamento", CHANGE.HOME_PUBLICA, null),
  automatica("seo", "SEO e metadados", "metadados corretos", CHANGE.HOME_PUBLICA, null),
  automatica("links", "Links quebrados", "zero", CHANGE.HOME_PUBLICA, null),
  automatica(
    "cabecalhos",
    "Cabeçalhos de segurança",
    "CSP, HSTS e afins presentes",
    CHANGE.HOME_PUBLICA,
    null,
  ),
  automatica("migracao", "Migração e banco", "aplica do zero e sobre dados", CHANGE.PERSISTENCIA, null),
  automatica("cache", "Cache e invalidação", "invalida só as etiquetas certas", CHANGE.PERSISTENCIA, null),
  automatica(
    "autenticacao",
    "Autenticação e autorização",
    "ação protegida recusada sem sessão",
    CHANGE.LOGIN,
    null,
  ),
  automatica(
    "limite-de-login",
    "Limite de tentativas de login",
    "bloqueio após o limite",
    CHANGE.LOGIN,
    null,
  ),
  automatica("csrf-injecao", "CSRF e injeção", "recusados ou neutralizados", CHANGE.LOGIN, null),
  automatica("dast", "DAST (ZAP)", "zero alertas médios ou maiores", CHANGE.LOGIN, null),
  automatica("ssrf", "Validação de URL externa", "só domínios do Google", CHANGE.DRIVE, null),
  automatica("resiliencia", "Resiliência de serviço externo", "erro tratado", CHANGE.DRIVE, null),
  automatica("pos-deploy", "Smoke pós-deploy e backup", "ok", CHANGE.DEPLOY, null),
];
