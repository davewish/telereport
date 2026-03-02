import { Request, Response } from "express";

import * as service from "./patient.service";
import { calculateHealthScore } from "../../services/healthScore.service";
import { CreateReportInput } from "../reports/report.schema";
import { getReportsByPatient } from "../reports/report.service";

export const create = async (req: Request, res: Response) => {
  const patient = await service.createPatient(req.body);
  res.status(201).json(patient);
};

export const getPatients = async (req: Request, res: Response) => {
  const start = Date.now();
  while (Date.now() - start < 1000) {
    // block CPU for 300ms
  }
  const patients = await service.getPatients();
  res.json(patients);
};

export const getPatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = await service.getPatientById(id as string);
  res.json(patient);
};
export const getScore = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reports = await getReportsByPatient(id as string);

  const scores = reports.map((report: any) => {
    return calculateHealthScore({
      heartRate: report.heartRate,
      oxygenLevel: report.oxygenLevel,
      temperature: report.temperature,
    });
  });
  res.json(scores);
};
