"use server";
import { prisma } from "../prisma";
import { createManyOffers } from "./offers";

function countDriversByClusterAndShift(drivers) {
  return Object.values(
    drivers.reduce((acc, { cluster, shift, driver_id }) => {
      const key = `${cluster}-${shift}`;
      if (!acc[key]) {
        acc[key] = {
          cluster,
          shift,
          spots: 0,
          duration: 60,
          station: "OF Hub_SP_Lapa",
          offer_type: "AUTOMATIC",
        };
      }
      acc[key].spots++;
      return acc;
    }, {})
  );
}

export const createManyAllocations = async (allocations: any): Promise<any> => {
  const offersToCreate = countDriversByClusterAndShift(allocations);

  const createdOffers = await createManyOffers(offersToCreate);

  const parsed = allocations.map((a: any) => {
    const offerId = createdOffers.find(
      (o) => o.shift === a.shift && o.cluster === a.cluster
    )?.id;

    return {
      ...a,
      driver_id: a.driver_id.toString(),
      updatedAt: new Date(),
      createdAt: new Date(),
      offerId,
    };
  });

  return await prisma.allocations.createManyAndReturn({
    data: parsed,
  });
};
