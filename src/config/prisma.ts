import { logger } from "./logger";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("query", (e) => {
  logger.debug(
    {
      query: e.query,
      params: e.params,
      duration: e.duration,
    },
    "Prisma Query",
  );
});

prisma.$on("error", (e) => {
  logger.error(e, "Prisma Error");
});
export default prisma;
