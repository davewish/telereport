const prismaMock = {
  patient: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    createMany: jest.fn(),
  },
  report: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};
export default prismaMock;
