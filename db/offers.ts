"use server";
import { prisma } from "../prisma";

export const createManyOffers = async (offers: any): Promise<any> => {
  const parsed = offers.map((a: any) => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + a.duration || 60);

    return {
      ...a,
      updatedAt: new Date(),
      createdAt: new Date(),
      endTime: endTime.toISOString(),
      spots: a.spots || 1,
      duration: a.duration || 60,
    };
  });

  return await prisma.offers.createManyAndReturn({
    data: parsed,
  });
};
