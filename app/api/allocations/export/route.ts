import { prisma } from "@/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const actives = url.searchParams.get("actives");
  const format = url.searchParams.get("format");

  const where = actives ? { where: { endTime: { gt: new Date() } } } : {};

  if (format === "csv") {
    const allocations = await prisma.allocations.findMany(where);
    const csv = allocations.map((allocation) => {
      return `${allocation.driver_id},${allocation.shift},${allocation.cluster},${allocation.type},${allocation.createdAt}`;
    });

    const firstRow = ["driver_id", "shift", "cluster", "type", "createdAt"];

    csv.unshift(firstRow);

    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename="allocations.csv"`
    );

    return new Response(csv.join("\n"), {
      headers,
    });
  } else if (format === "json") {
    const allocations = await prisma.allocations.findMany(where);
    return new Response(JSON.stringify(allocations), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=allocations.json",
      },
    });
  } else {
    return new Response("Unsupported format", { status: 400 });
  }
}
