"use server";
import { prisma } from "../prisma";
import { createManyOffers } from "./offers";

function countDriversByClusterAndShift(drivers: any, duration: number) {
  return Object.values(
    drivers.reduce((acc: any, { cluster, shift, driver_id }: any) => {
      const key = `${cluster}-${shift}`;
      if (!acc[key]) {
        acc[key] = {
          cluster,
          shift,
          spots: 0,
          duration,
          station: "OF Hub_SP_Lapa",
          offer_type: "AUTOMATIC",
        };
      }
      acc[key].spots++;
      return acc;
    }, {})
  );
}

export const createManyAllocations = async (
  allocations: any,
  duration: number
): Promise<any> => {
  const offersToCreate = countDriversByClusterAndShift(allocations, duration);

  const createdOffers = await createManyOffers(offersToCreate, duration);

  const parsed = allocations
    .map((a: any) => {
      const offer = createdOffers.find(
        (o: any) => o.shift === a.shift && o.cluster === a.cluster
      );

      const offerId = offer?.id;
      const endTime = offer?.endTime;

      return {
        driver_id: a.driver_id?.toString(),
        description: a.description,
        updatedAt: new Date(),
        createdAt: new Date(),
        offerId,
        endTime,
      };
    })
    .filter((a: any) => !!a.driver_id);

  return await prisma.allocations.createManyAndReturn({
    data: parsed,
  });
};
