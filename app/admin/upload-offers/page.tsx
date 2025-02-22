import { MainLayout } from "@premieroctet/next-admin";
import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { options } from "@/admin-options";
import { Component } from "./component";
import { Suspense } from "react";

const CustomPage = async () => {
  const mainLayoutProps = getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options,
  });

  return (
    <Suspense>
      <MainLayout {...mainLayoutProps}>
        <Component />
      </MainLayout>
    </Suspense>
  );
};

export default CustomPage;
