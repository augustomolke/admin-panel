import { NextAdminOptions } from "@premieroctet/next-admin";
import ConfirmationDialogAllocations from "@/components/confirmation-dialog-allocations";
import ConfirmationDialogOffers from "@/components/confirmation-dialog-offers";

export const options: NextAdminOptions = {
  title: "Admin Alocador",
  model: {
    /* Your model configuration here */
    Allocations: {
      edit: {
        display: ["driver_id", "shift", "cluster", "duration", "description"],

        hooks: {
          beforeDb: async (row) => {
            const endTime = new Date();
            const duration = row.duration ? Number(row.duration) : 60;

            endTime.setMinutes(endTime.getMinutes() + duration);

            return { ...row, type: "MANUAL", endTime: endTime.toISOString() };
          },
        },
      },
      list: {
        exports: [
          {
            format: "Tudo",
            url: "/api/allocations/export?format=csv",
          },
          {
            format: "Ativos",
            url: "/api/allocations/export?format=csv&actives=true",
          },
        ],
        filters: [
          async () => {
            const currentdate = new Date();

            return [
              {
                name: "is Active",
                active: true,
                value: {
                  endTime: { gte: currentdate },
                },
              },
            ];
          },
        ],
      },
      actions: [
        {
          type: "dialog",
          component: <ConfirmationDialogAllocations />,
          title: "Enviar Wsp Alocação",
          id: "submit-whatsapp-allocations",
          // action: async (ids) => {
          //   await sendWspToList(ids);
          //   console.log("Sending Whatsapp to " + ids.length + " users");
          // },
          // successMessage: "Whatsapp enviado com sucesso!",
          // errorMessage:
          //   "Erro ao enviar whatsapp! Contate o coitado do augusto.",
        },
      ],
    },
    Offers: {
      edit: {
        display: [
          "cluster",
          "shift",
          "spots",
          "duration",
          "station",
          "description",
        ],
        hooks: {
          beforeDb: async (row) => {
            const endTime = new Date();

            const duration = row.duration ? Number(row.duration) : 60;

            endTime.setMinutes(endTime.getMinutes() + duration);

            return { ...row, endTime: endTime.toISOString() };
          },
        },
      },
      actions: [
        {
          type: "dialog",
          component: <ConfirmationDialogOffers />,
          title: "Enviar Wsp Crowdsourcing",
          id: "submit-whatsapp-offers",
          // action: async (ids) => {
          //   await sendWspToList(ids);
          //   console.log("Sending Whatsapp to " + ids.length + " users");
          // },
          // successMessage: "Whatsapp enviado com sucesso!",
          // errorMessage:
          //   "Erro ao enviar whatsapp! Contate o coitado do augusto.",
        },
      ],
      list: {
        exports: [
          {
            format: "Tudo",
            url: "/api/offers/export?format=csv",
          },
          {
            format: "Ativos",
            url: "/api/offers/export?format=csv&actives=true",
          },
        ],
        filters: [
          async () => {
            const currentdate = new Date();

            return [
              {
                name: "is Active",
                active: true,
                value: {
                  endTime: { gte: currentdate },
                },
              },
            ];
          },
        ],
      },
    },
    Bookings: {},
    Preferences: {},
    Drivers: {},
    Options: {
      list: {
        fields: {
          options: {
            formatter: (a: any) => {
              console.log(a);
              return JSON.parse(a).hub;
            },
          },
        },
      },
    },
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
