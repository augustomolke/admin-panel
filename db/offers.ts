"use server";
import { prisma } from "../prisma";

export const createManyOffers = async (offers: any): Promise<any> => {
  const parsed = offers.map((a) => {
    return {
      ...a,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
  });

  return await prisma.offers.createManyAndReturn({
    data: parsed,
  });
};
