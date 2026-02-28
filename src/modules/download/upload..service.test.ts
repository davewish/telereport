import { getPatientByHospitalId } from "./download.service";
import prisma from "../../config/prisma";
jest.mock("../../config/prisma");
describe("exportPatients", () => {
  const mockRes: any = {
    setHeader: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch patients without cursor", async () => {
    const mockedPatients = [{ id: "1" }];
    (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockedPatients);

    const result = await getPatientByHospitalId("h1", undefined, 1000);

    expect(prisma.patient.findMany).toHaveBeenCalledWith({
      where: { hospitalId: "h1" },
      take: 1000,
      orderBy: { id: "asc" },
    });
    expect(result).toEqual(mockedPatients);
  });
  it("should fetch patients with cursor", async () => {
    const mockedPatients = [{ id: "2" }];
    (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockedPatients);

    const result = await getPatientByHospitalId("h1", "1", 1000);

    expect(prisma.patient.findMany).toHaveBeenCalledWith({
      where: { hospitalId: "h1" },
      take: 1000,
      skip: 1,
      cursor: { id: "1" },
      orderBy: { id: "asc" },
    });

    expect(result).toEqual(mockedPatients);
  });
});
