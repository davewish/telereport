import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
});

export const reportGeneratedCounter = new client.Counter({
  name: "report_generated_total",
  help: "Total number of generated reports",
});
