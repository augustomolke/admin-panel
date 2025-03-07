"use server";

import { prisma } from "@/prisma";
import { sleep } from "./utils";
import { OwnFlexShifts } from "./shifts";

const url = process.env.NOTI_URL || "";
const task_name = process.env.TASK_NAME || "";
const x_sp_sdu = process.env.X_SP_SDU || "";
const x_sp_servicekey = process.env.X_SP_SERVICEKEY || "";
const offer_task_name = process.env.OFFER_TASK_NAME || "";

export const sendWspToList = async (ids: any) => {
  const allocations = await prisma.allocations.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      driver_id: true,
      Offers: true,
    },
  });

  const drivers = await prisma.drivers.findMany({
    where: {
      driver_id: {
        in: allocations.map((a) => a.driver_id),
      },
    },
  });

  for (const driver of drivers) {
    const phone_number =
      driver.phone.length == 11 ? `55${driver.phone}` : driver.phone;
    const name = driver.name.split(" ")[0];

    const shifts = allocations
      .filter((a) => a.driver_id == driver.driver_id)
      .map((a) => a.Offers?.description)
      .join(", ");

    const slot = shifts;

    const data = {
      phone_number,
      language: "pt-BR",
      name,
      slot,
    };

    await sleep(5000);

    await sendWsp(data, task_name);
  }
};

export const sendCrowdSourcingWsp = async (ids: any) => {
  const now = new Date();

  const allocations = await prisma.allocations.groupBy({
    by: ["driver_id"],
    _count: {
      offerId: true,
    },
    where: {
      endTime: {
        gte: now,
      },
    },
  });

  const available_drivers = allocations
    .filter((a) => a._count.offerId >= 2)
    .map((d) => d.driver_id);

  const drivers = await prisma.drivers.findMany({
    where: {
      driver_id: { not: { in: available_drivers } },
      ownflex: true,
    },
  });

  const payloads = drivers.map((d) => ({ phone_number: d.phone }));

  for (const { phone_number } of payloads) {
    const data = {
      phone_number,
      language: "pt-BR",
    };

    await sleep(5000);

    await sendWsp(data, offer_task_name);
  }
};

export const sendWsp = async (data: any, task_name: string) => {
  const payload = {
    task_name,
    json_data: JSON.stringify(data),
  };

  const headers = {
    "Content-Type": "application/json",
    "shopee-baggage": "CID=br",
    "x-sp-sdu": x_sp_sdu,
    "x-sp-servicekey": x_sp_servicekey,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const res = await response.json();

    console.log("RES", res);
  } catch (error) {
    console.log("Error sending notification", error);
  }
};

async function processPromisesWithDelay(
  promises: (() => Promise<any>)[],
  delay: number
) {
  const results = [];
  for (const promise of promises) {
    results.push(await promise());
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return results;
}
