import { stringify } from "csv-stringify";

import { exportPatients } from "./download.controller";
import * as service from "./download.service";

jest.mock("./download.service");
jest.mock("csv-stringify");

describe("exportPatients Controller", () => {
  let mockReq: any;
  let mockRes: any;
  let mockCsvStream: any;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  mockReq = {
    params: { hospitalId: "h1" },
  };
  mockRes = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  mockCsvStream = {
    pipe: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    destroy: jest.fn(),
  };
  (stringify as jest.Mock).mockReturnValue(mockCsvStream);
  it("should stream patients in batches", async () => {
    const firstBatch = [
      {
        id: "1",
        name: "John",
        lastName: "Doe",
        email: "john@test.com",
        createdAt: new Date("2024-01-01"),
      },
    ];
    (service.getPatientByHospitalId as jest.Mock)
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce([]);
    await exportPatients(mockReq, mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");

    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      'attachment; filename="patients-h1.csv"',
    );

    expect(mockCsvStream.pipe).toHaveBeenCalledWith(mockRes);

    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);

    expect(service.getPatientByHospitalId).toHaveBeenCalledTimes(2);

    expect(mockCsvStream.end).toHaveBeenCalled();
  });
  it("should sanitize dangerous CSV values", async () => {
    const batch = [
      {
        id: "1",
        name: "=CMD()",
        lastName: "Doe",
        email: "+malicious@test.com",
        createdAt: new Date("2024-01-01"),
      },
    ];

    (service.getPatientByHospitalId as jest.Mock)
      .mockResolvedValueOnce(batch)
      .mockResolvedValueOnce([]);

    await exportPatients(mockReq, mockRes);

    const writtenData = mockCsvStream.write.mock.calls[0][0];

    expect(writtenData.name).toBe("'=CMD()");
    expect(writtenData.email).toBe("'+malicious@test.com");
  });
  it("should destroy stream on error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (service.getPatientByHospitalId as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await exportPatients(mockReq, mockRes);

    expect(mockCsvStream.destroy).toHaveBeenCalled();
  });
});
