"use server";
import { prisma } from "../prisma";

export const createManyOffers = async (offers: any): Promise<any> => {
  const parsed = offers.map((a: any) => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + a.duration);

    return {
      ...a,
      updatedAt: new Date(),
      createdAt: new Date(),
      endTime,
    };
  });

  return await prisma.offers.createManyAndReturn({
    data: parsed,
  });
};
