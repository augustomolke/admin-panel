import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const actives = url.searchParams.get("actives");

  const where: Prisma.OffersWhereInput = actives
    ? { endTime: { gt: new Date() } }
    : {};
  if (format === "csv") {
    const offers = await prisma.offers.findMany({ where });
    const csv = offers.map((offer) => {
      return `${offer.cluster},${offer.shift},${offer.duration},${offer.spots},${offer.createdAt}, ${offer.station}`;
    });

    const firstRow = [
      "cluster",
      "shift",
      "duration",
      "spots",
      "createdAt",
      "station",
      "offer_type",
    ].join(",");

    csv.unshift(firstRow);

    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename="crowdsourcing-offers.csv"`
    );

    return new Response(csv.join("\n"), {
      headers,
    });
  } else if (format === "json") {
    const offers = await prisma.offers.findMany({ where });
    return new Response(JSON.stringify(offers), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=crowdsourcing-offers.json",
      },
    });
  } else {
    return new Response("Unsupported format", { status: 400 });
  }
}
