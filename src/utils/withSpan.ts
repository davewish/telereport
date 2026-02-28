import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("report-service");

export const withSpan = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
};
