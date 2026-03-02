import cors from "cors";
import express from "express";
import helmet from "helmet";
import client from "prom-client";

import { errorHandler } from "./src/middleware/errorHandler";
import { metricsMiddleware } from "./src/middleware/metricsMiddleware";
import { limiter, strictLimiter } from "./src/middleware/rateLimit";
import { requestLogger } from "./src/middleware/requestLogger";
import downloadRoute from "./src/modules/download/download.routes";
import patientRoutes from "./src/modules/patients/patient.routes";
import reportRoutes from "./src/modules/reports/report.routes";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = ["http://localhost:3000", "https://your-frontend.com"];
app.use(helmet());
app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use(requestLogger);
// if (isProduction) {
//   app.use(strictLimiter);
// } else {
//   app.use(limiter);
// }

app.get("/health", (req, res) => {
  res.json({ message: "OK" });
});
app.use("/auth/login", strictLimiter);
app.use("/patients", patientRoutes);
app.use("/reports", reportRoutes);
app.use("/hospitals", downloadRoute);

app.use(errorHandler);
export default app;
