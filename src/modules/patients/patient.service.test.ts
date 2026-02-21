import prisma from "../../config/prisma";
import { createPatient, getPatientById } from "../../modules/patients/patient.service";
import { AppError } from "../../utils/appError";

jest.mock("../../config/prisma");

describe("Patient Service", () => {
  afterEach(() => {
    jest.clearAllMocks;
  });
  describe("createPatient", () => {
    it("should create patient if email does not exist", async () => {
      (prisma.patient.findUnique as jest.Mock).mockReturnValue(null);
      (prisma.patient.create as jest.Mock).mockReturnValue({
        id: "1",
        name: "John",
        email: "test@gmail.com",
      });
      const result = await createPatient({
        name: "John",
        email: "john@mail.com",
        age: 30,
        gender: "MALE",
        condition: "Healthy",
      });
      expect(result.email).toBe("test@gmail.com");
      expect(prisma.patient.create).toHaveBeenCalled();
    });
    it("shlould throw error if email exists", async () => {
      (prisma.patient.findUnique as jest.Mock).mockReturnValue({ id: "1" });

      await expect(
        createPatient({
          name: "John",
          email: "john@mail.com",
          age: 30,
          gender: "MALE",
          condition: "Healthy",
        }),
      ).rejects.toThrow(AppError);
    });
  });
  describe("getPatientById", () => {
    it("should throw error if not found", async () => {
      (prisma.patient.findUnique as jest.Mock).mockReturnValue(null);
      await expect(getPatientById("123")).rejects.toThrow(AppError);
    });
  });
});
