"use server";
import { prisma } from "../prisma";

export const createManyOffers = async (
  offers: any,
  duration: number
): Promise<any> => {
  const parsed = offers
    .filter((o: any) => !!o.cluster)
    .map((a: any) => {
      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + duration);

      return {
        ...a,
        updatedAt: new Date(),
        createdAt: new Date(),
        endTime: endTime.toISOString(),
        spots: a.spots || 1,
        duration: duration,
      };
    });

  return await prisma.offers.createManyAndReturn({
    data: parsed,
  });
};
