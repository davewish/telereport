import request from "supertest";

import app from "../../../app";
import prisma from "../../config/prisma";

describe("Patient Integration Test", () => {
  beforeAll(async () => {
    await prisma.report.deleteMany();
    await prisma.patient.deleteMany();
  });
  it("should create patient", async () => {
    const res = await request(app).post("/patients").send({
      name: "Jane",
      email: "jane@mail.com",
      age: 28,
      gender: "MALE",
      condition: "Stable",
    });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe("jane@mail.com");
  });
});
