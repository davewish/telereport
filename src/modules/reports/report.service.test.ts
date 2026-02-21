import { createReport, getReportsByPatient } from "./report.service";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

jest.mock("../../config/prisma");
describe("Report Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Report Tests", () => {
    describe("createPatient", () => {
      it("should create report ", async () => {
        (prisma.report.create as jest.Mock).mockReturnValue({
          id: "12",
          patientId: "10",
          heartRate: 100,
          systolicBP: 20,
          diastolicBP: 20,
          oxygenLevel: 10.3,
          temperature: 25,
          symptoms: "good",
        });

        const result = await createReport({
          patientId: "10",
          heartRate: 100,
          systolicBP: 20,
          diastolicBP: 20,
          oxygenLevel: 10.3,
          temperature: 25,
          symptoms: "good",
        });
        expect(result.patientId).toBe("10");
        expect(result.heartRate).toBe(100);
      });
    });
    describe("getReportsByPatient", () => {
      it("should return reports", async () => {
        (prisma.patient.findUnique as jest.Mock).mockReturnValue({ id: 1 });
        (prisma.report.findMany as jest.Mock).mockReturnValue([
          {
            id: "12",
            patientId: "10",
            heartRate: 100,
            systolicBP: 20,
            diastolicBP: 20,
            oxygenLevel: 10.3,
            temperature: 25,
            symptoms: "good",
          },
        ]);
        const result = await getReportsByPatient("10");
        expect(result.length).toBe(1);
        expect(result[0].id).toBe("12");
      });
      it("should throw error when patient does not exit", async () => {
        (prisma.patient.findUnique as jest.Mock).mockReturnValue(null);
        await expect(getReportsByPatient("13")).rejects.toThrow(AppError);
      });
    });
  });
});
