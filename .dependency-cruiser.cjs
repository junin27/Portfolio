// Teste de arquitetura (ADR-0013): a regra da dependência da Clean Architecture,
// verificada sobre os imports resolvidos (inclusive alias "@/").
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "sem-ciclos",
      severity: "error",
      comment: "Ciclos de dependência deixam as camadas inseparáveis.",
      from: {},
      to: { circular: true },
    },
    {
      name: "dominio-independente",
      severity: "error",
      comment: "dominio é o centro: não depende de nenhuma outra camada nem de pacote externo.",
      from: { path: "^src/dominio/" },
      to: { pathNot: ["^src/dominio/"] },
    },
    {
      name: "aplicacao-so-depende-de-dominio",
      severity: "error",
      comment: "aplicacao só conhece dominio; I/O entra por portas.",
      from: { path: "^src/aplicacao/" },
      to: { pathNot: ["^src/aplicacao/", "^src/dominio/"] },
    },
    {
      name: "ui-so-recebe-props",
      severity: "error",
      comment: "ui não chama casos de uso nem infraestrutura.",
      from: { path: "^src/ui/" },
      to: { path: ["^src/aplicacao/", "^src/infraestrutura/", "^src/servidor/", "^src/app/"] },
    },
    {
      name: "infraestrutura-nao-depende-da-interface",
      severity: "error",
      comment: "infraestrutura implementa portas; não importa app nem ui.",
      from: { path: "^src/infraestrutura/" },
      to: { path: ["^src/app/", "^src/ui/"] },
    },
    {
      name: "producao-nao-importa-testes",
      severity: "error",
      comment: "Código de produção nunca depende de fakes ou utilitários de teste.",
      from: { path: "^src/", pathNot: "\\.test\\.tsx?$" },
      to: { path: "^tests/" },
    },
    {
      name: "sem-import-nao-resolvido",
      severity: "error",
      comment: "Import que não resolve é erro de digitação ou dependência faltando.",
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: ["\\.next/", "node_modules/"] },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types", "typings"],
    },
  },
};
