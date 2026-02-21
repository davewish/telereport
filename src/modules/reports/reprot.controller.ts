import { Request, Response } from "express";

import * as service from "./report.service";

export const create = async (req: Request, res: Response) => {
  const report = await service.createReport(req.body);
  res.status(201).json(report);
};

export const getReportsByPatient = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const reports = await service.getReportsByPatient(patientId as string);
  res.json(reports);
};
