import { PrismaClient } from "@prisma/client";

import { logger } from "./logger";
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("query", (e: { query: any; params: any; duration: any }) => {
  logger.debug(
    {
      query: e.query,
      params: e.params,
      duration: e.duration,
    },
    "Prisma Query",
  );
});

prisma.$on("error", (e: any) => {
  logger.error(e, "Prisma Error");
});
export default prisma;
