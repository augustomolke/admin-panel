"use server";
import { prisma } from "../prisma";

export const createManyAllocations = async (allocations: any): Promise<any> => {
  const parsed = allocations.map((a) => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + 60);

    return {
      ...a,
      driver_id: a.driver_id.toString(),
      duration: 60,
      updatedAt: new Date(),
      createdAt: new Date(),
      type: "AUTOMATIC",
      endTime,
    };
  });
  return await prisma.allocations.createManyAndReturn({
    data: parsed,
  });
};
