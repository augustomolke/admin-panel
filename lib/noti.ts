"use server";

import { prisma } from "@/prisma";
import { sleep } from "./utils";
import { OwnFlexShifts } from "./shifts";
// import { sendWsp } from "./teste";

const url = process.env.NOTI_URL || "";
const task_name = process.env.TASK_NAME || "";
const x_sp_sdu = process.env.X_SP_SDU || "";
const x_sp_servicekey = process.env.X_SP_SERVICEKEY || "";

export const sendWspToList = async (ids: any) => {
  const allocations = await prisma.allocations.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      driver_id: true,
      shift: true,
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
      .map((a) => a.shift)
      .map((s) => OwnFlexShifts.find((a) => a.id == s).description)
      .join(", ");

    const slot = shifts;

    const data = {
      phone_number,
      language: "pt-BR",
      name,
      slot,
    };

    await sleep(5000);

    await sendWsp(data);
  }

  //   const promises = drivers.map((driver, idx) => async () => {
  //     const phone_number =
  //       driver.phone.length == 11 ? `55${driver.phone}` : driver.phone;
  //     const name = driver.name.split(" ")[0];

  //     const shift = allocations.find(
  //       (a) => a.driver_id == driver.driver_id
  //     )?.shift;

  //     const slot = shift;

  //     const data = {
  //       phone_number,
  //       language: "pt-BR",
  //       name,
  //       slot,
  //     };

  //     await sendWsp(data);
  //   });

  //   await processPromisesWithDelay(promises, 5000);
};

export const sendWsp = async (data: any) => {
  const payload = {
    task_name: task_name,
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
  } catch (error) {
    console.log("Error sending notification", error);
  }
};

async function processPromisesWithDelay(promises, delay) {
  const results = [];
  for (const promise of promises) {
    results.push(await promise());
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return results;
}
