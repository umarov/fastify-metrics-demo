import Fastify, { FastifyReply } from "fastify";
import fastifyMetrics from "fastify-metrics";

const mainApp = Fastify({ logger: true });
const metricsApp = Fastify({ logger: true });

await mainApp.register(fastifyMetrics, {
  endpoint: null,
});

mainApp.get("/", () => {
  return { hello: "world" };
});

metricsApp.get(
  "/metrics",
  { logLevel: "error" },
  async (_, reply: FastifyReply) => {
    return reply
      .header("Content-Type", mainApp.metrics.client.register.contentType)
      .send(await mainApp.metrics.client.register.metrics());
  }
);

try {
  await mainApp.listen({ port: 3000, host: "0.0.0.0" });
  await metricsApp.listen({ port: 3001, host: "0.0.0.0" });
} catch (err) {
  mainApp.log.error(err);
  process.exit(1);
}
