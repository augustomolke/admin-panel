import {
  NextAdmin,
  PageProps,
  PromisePageProps,
} from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { prisma } from "@/prisma";
import "../../globals.css"; // .css file containing tailiwnd rules
import { options } from "@/admin-options";

export default async function AdminPage({
  params,
  searchParams,
}: PromisePageProps) {
  const prom = await params;

  const search = await searchParams;

  const props = await getNextAdminProps({
    params: prom.nextadmin,
    searchParams: search,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options,
  });

  return <NextAdmin {...props} />;
}
