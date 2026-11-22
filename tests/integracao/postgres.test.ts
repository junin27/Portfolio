import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";

// Prova que o harness de integração sobe um Postgres real e descartável, sem configuração manual.
const IMAGEM_POSTGRES = "postgres:17-alpine";

describe("harness de integração com Postgres", () => {
  let container: StartedPostgreSqlContainer;
  let cliente: Client;

  beforeAll(async () => {
    container = await new PostgreSqlContainer(IMAGEM_POSTGRES).start();
    cliente = new Client({ connectionString: container.getConnectionUri() });
    await cliente.connect();
  });

  afterAll(async () => {
    await cliente.end();
    await container.stop();
  });

  it("executa uma consulta no banco do container", async () => {
    const resultado = await cliente.query<{ valor: number }>("SELECT 1 AS valor");

    expect(resultado.rows[0]?.valor).toBe(1);
  });
});
