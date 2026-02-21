import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

export const createReport = (data: any) => {
  return prisma.report.create({ data });
};

export const getReportsByPatient = async (patientId: string) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new AppError("patient not found", 404);
  }
  return prisma.report.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
};

export const createReportWithEvaluation = async (data: any) => {
  return prisma.$transaction(async (tx) => {
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
  });
};

export const updatePatientCondition = async (id: string, condition: string, version: number) => {
  const updated = await prisma.patient.updateMany({
    where: { id, version },
    data: { condition, version: { increment: 1 } },
  });
  if (updated.count === 0) {
    throw new AppError("Conflict: patient was updated by some else", 409);
  }
  return prisma.patient.findUnique({ where: { id } });
};
