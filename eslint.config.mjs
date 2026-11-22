import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Regras de camada (ADR-0013). O dependency-cruiser é a verificação completa;
// aqui o lint avisa já no editor, pelos imports com alias.
const CAMADAS_EXTERNAS_AO_DOMINIO = [
  "@/aplicacao/*",
  "@/infraestrutura/*",
  "@/app/*",
  "@/ui/*",
  "@/servidor/*",
];
const CAMADAS_EXTERNAS_A_APLICACAO = ["@/infraestrutura/*", "@/app/*", "@/ui/*", "@/servidor/*"];
const BIBLIOTECAS_PROIBIDAS_NO_NUCLEO = [
  "next",
  "next/*",
  "react",
  "react-dom",
  "@prisma/*",
  "zod",
  "gsap",
  "gsap/*",
  "pg",
  "node:*",
  "fs",
  "path",
];

const LIMITE_LINHAS_POR_ARQUIVO = 500;
const LIMITE_LINHAS_POR_FUNCAO = 40;

function proibirImports(padroes, motivo) {
  return ["error", { patterns: [{ group: padroes, message: motivo }] }];
}

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "reports/**", "next-env.d.ts"]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
      "max-lines": ["error", { max: LIMITE_LINHAS_POR_ARQUIVO, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "warn",
        { max: LIMITE_LINHAS_POR_FUNCAO, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["src/dominio/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-restricted-imports": proibirImports(
        [...CAMADAS_EXTERNAS_AO_DOMINIO, ...BIBLIOTECAS_PROIBIDAS_NO_NUCLEO],
        "dominio é o centro da Clean Architecture: não importa outras camadas nem bibliotecas de I/O (ADR-0013).",
      ),
    },
  },
  {
    files: ["src/aplicacao/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-restricted-imports": proibirImports(
        [...CAMADAS_EXTERNAS_A_APLICACAO, ...BIBLIOTECAS_PROIBIDAS_NO_NUCLEO],
        "aplicacao só depende de dominio; dependências externas entram por portas (ADR-0013).",
      ),
    },
  },
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": proibirImports(
        ["@/aplicacao/*", "@/infraestrutura/*", "@/servidor/*"],
        "ui recebe dados prontos por props; não chama casos de uso nem infraestrutura (ADR-0013).",
      ),
    },
  },
  {
    files: ["src/infraestrutura/**/*.ts"],
    rules: {
      "no-restricted-imports": proibirImports(
        ["@/app/*", "@/ui/*"],
        "infraestrutura implementa portas; não depende da interface (ADR-0013).",
      ),
    },
  },
  {
    // Testes e arquivos de configuração usam números literais de tempo e tamanho à vontade.
    files: ["**/*.test.{ts,tsx}", "**/*.spec.ts", "tests/**", "*.config.{ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
      "max-lines-per-function": "off",
    },
  },
]);
