import { stringify } from "csv-stringify";
import { Request, Response } from "express";

import { getPatientByHospitalId } from "./download.service";
const sanitize = (value: string) => {
  if (typeof value === "string" && /^[=+\-@]/.test(value)) {
    return `'${value}`;
  }
  return value;
};
export const exportPatients = async (req: Request, res: Response) => {
  const { hospitalId } = req.params;
  const BATCH_SIZE = 1000;
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="patients-${hospitalId}.csv"`);
  const csvStream = stringify({
    header: true,
    columns: ["id", "name", "email", "age", "condition", "gender"],
  });

  csvStream.pipe(res);
  let cursor: string | undefined = undefined;
  try {
    while (true) {
      const patients = await getPatientByHospitalId(hospitalId as string, cursor, BATCH_SIZE);

      if (patients.length === 0) break;
      for (const patient of patients) {
        const patientToBeSent = {
          id: patient.id,

          name: sanitize(patient.name),
          email: sanitize(patient.email),
          age: patient.age,
          condition: sanitize(patient.condition),
          gender: sanitize(patient.gender),
        };

        csvStream.write(patientToBeSent);
      }
      cursor = patients[patients.length - 1].id;
    }
    csvStream.end(res);
  } catch (error: any) {
    console.error("Export Error", error);
    csvStream.destroy(error);
  }
};
