import request from "supertest";

import app from "../../../app";
import prisma from "../../config/prisma";
describe("download integration test ", () => {
  beforeEach(async () => {
    await prisma.report.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.hospital.deleteMany();
  });
  afterAll(() => {
    prisma.$disconnect();
  });

  it("should download the patients successfully", async () => {
    await prisma.hospital.create({
      data: {
        id: "h1",
        name: "heartbeat",
      },
    });

    await prisma.patient.createMany({
      data: [
        {
          id: "p1",
          hospitalId: "h1",
          name: "John",
          email: "john@test.com",
          gender: "MALE",
          age: 40,
          condition: "good",
        },
      ],
    });

    const response = await request(app).get("/hospitals/h1/export").expect(200);

    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.headers["content-disposition"]).toContain("patients-h1.csv");

    const lines = response.text.trim().split("\n");

    expect(lines[0]).toBe("id,name,email,age,condition,gender");

    expect(lines[1]).toContain("john@test.com");
  });
});
