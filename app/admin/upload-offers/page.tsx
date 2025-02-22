import { MainLayout } from "@premieroctet/next-admin";
import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { options } from "@/admin-options";
import { Component } from "./component";

const CustomPage = async () => {
  const mainLayoutProps = getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options,
  });

  return (
    <MainLayout {...mainLayoutProps}>
      <Component />
    </MainLayout>
  );
};

export default CustomPage;
