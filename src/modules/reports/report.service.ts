import { Prisma } from "@prisma/client";

import { CreateReportInput } from "./report.schema";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { withSpan } from "../../utils/withSpan";

type Report = Awaited<ReturnType<typeof prisma.report.create>>;
export const createReport = (data: CreateReportInput) => {
  return withSpan<Report>("createReport", () => prisma.report.create({ data }));
};

export const getReportsByPatient = async (patientId: string) => {
  return withSpan<Report[]>("getReportsByPatient", async () => {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new AppError("patient not found", 404);
    }

    const reports = await prisma.report.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });

    return reports;
  });
};

export const createReportWithEvaluation = async (data: CreateReportInput) => {
  return withSpan("createReportWithEvaluation", () =>
    prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const patient = await tx.patient.findUnique({
        where: { id: data.patientId },
      });
      if (!patient) {
        throw new AppError("Patient not found", 404);
      }
      const highRisk = data.heartRate > 120 || data.oxygenLevel < 92 || data.temperature > 39;
      const riskLevel = highRisk ? "HIGH" : "NORMAL";
      const report = await tx.report.create({ data: { ...data, riskLevel } });
      if (riskLevel) {
        await tx.patient.update({
          where: { id: patient.id },
          data: { condition: "Critical" },
        });
        return report;
      }
    }),
  );
};
