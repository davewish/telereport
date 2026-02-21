import { CreatePatientInput } from "./patient.schema";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

export const createPatient = async (data: CreatePatientInput) => {
  const existingPatient = await prisma.patient.findUnique({
    where: { email: data.email },
  });
  if (existingPatient) {
    throw new AppError("Email aready exists", 409);
  }
  return prisma.patient.create({ data });
};
export const getPatients = async () => {
  return prisma.patient.findMany({ include: { reports: true } });
};
export const getPatientById = async (id: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { reports: true },
  });
  if (!patient) {
    throw new AppError("patient not found", 404);
  }
  return patient;
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
