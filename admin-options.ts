import { NextAdminOptions } from "@premieroctet/next-admin";

export const options: NextAdminOptions = {
  title: "Admin Alocador",
  model: {
    /* Your model configuration here */
  },
  pages: {
    "/upload-allocations": {
      title: "Upload Allocations",
      icon: "AdjustmentsHorizontalIcon",
    },
    "/upload-offers": {
      title: "Upload Clusters Crowdsourcing",
      icon: "AdjustmentsHorizontalIcon",
    },
  },
  externalLinks: [
    {
      label: "Webapp",
      url: "https://own-fleet.shps-br-services.com/",
    },
  ],
};
