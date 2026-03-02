import { Request, Response, NextFunction } from "express";

import { httpRequestDuration } from "../observability/metrics";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  // Flag to prevent double recording
  let metricsRecorded = false;

  // Function to record metrics
  const recordMetrics = () => {
    if (metricsRecorded) return;
    metricsRecorded = true;

    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    // Get route path
    let route = req.path;
    if (req.route && req.route.path) {
      route = req.baseUrl + req.route.path;
    }

    // Ensure we have a status code
    const statusCode = res.statusCode || 200;

    try {
      // Only pass 3 arguments as defined in the metric
      httpRequestDuration.labels(req.method, route, statusCode.toString()).observe(duration);
    } catch (error: any) {
      console.error("Error recording metrics:", error?.message);
    }
  };

  // Normal completion
  res.on("finish", () => {
    recordMetrics();
  });

  // Connection closed prematurely
  res.on("close", () => {
    if (!res.writableEnded && !metricsRecorded) {
      // Set appropriate status code for aborted requests
      if (!res.statusCode || res.statusCode === 200) {
        res.statusCode = 499; // Client Closed Request
      }
      recordMetrics();
    }
  });

  // Handle timeout
  req.on("timeout", () => {
    if (!metricsRecorded && !res.headersSent) {
      res.statusCode = 408; // Request Timeout
      recordMetrics();
    }
  });

  // Handle request errors
  req.on("error", (err) => {
    console.error("Request error:", err.message);
    if (!metricsRecorded) {
      res.statusCode = 500;
      recordMetrics();
    }
  });

  // Handle response errors
  res.on("error", (err) => {
    console.error("Response error:", err.message);
    if (!metricsRecorded) {
      recordMetrics();
    }
  });

  next();
};
