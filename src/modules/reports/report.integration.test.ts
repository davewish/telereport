import request from "supertest";

import app from "../../../app";
import prisma from "../../config/prisma";

describe("Reprot Integration Test", () => {
  beforeAll(async () => {
    await prisma.report.deleteMany();
    await prisma.hospital.deleteMany();
    await prisma.patient.deleteMany();
  });
  it("Report should create", async () => {
    const patientRes = await request(app).post("/patients").send({
      name: "John",
      email: "john@test.com",
      gender: "MALE",
      age: 39,
      condition: "healthy",
    });

    const reportRes = await request(app).post("/reports").send({
      patientId: patientRes.body.id,
      heartRate: 100,
      systolicBP: 120,
      diastolicBP: 80,
      oxygenLevel: 98,
      temperature: 36.5,
      symptoms: "good",
    });

    expect(reportRes.status).toBe(201);
    expect(reportRes.body.patientId).toBe(patientRes.body.id);
  });
});
