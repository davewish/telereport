import prisma from "../../config/prisma";

export const getPatientByHospitalId = async (
  hospitalId: string,
  cursor: string | undefined,
  BATCH_SIZE: number,
) => {
  const patients = await prisma.patient.findMany({
    where: { id: hospitalId },
    take: BATCH_SIZE,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { id: "asc" },
  });
  return patients;
};
