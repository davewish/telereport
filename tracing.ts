import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
  timeoutMillis: 3000, // important: never block too long
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log("Tracing initialized");

process.on("SIGTERM", async () => {
  await sdk.shutdown();
  console.log("Tracing terminated");
});
