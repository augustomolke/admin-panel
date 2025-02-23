import {
  NextAdminOptions,
  ClientActionDialogContentProps,
} from "@premieroctet/next-admin";
import { sendWspToList } from "@/lib/noti";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export const options: NextAdminOptions = {
  title: "Admin Alocador",
  model: {
    /* Your model configuration here */
    Allocations: {
      edit: {
        display: ["driver_id", "shift", "cluster", "duration"],

        hooks: {
          beforeDb: async (row) => {
            const endTime = new Date();
            endTime.setMinutes(
              endTime.getMinutes() + Number(row.duration) || 0
            );

            return { ...row, type: "MANUAL", endTime: endTime.toISOString() };
          },
        },
      },
      list: {
        filters: [
          async () => {
            const currentdate = new Date();

            return [
              {
                name: "is Active",
                active: false,
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
          type: "server",
          title: "Enviar Wsp Alocação",
          id: "submit-whatsapp",
          action: async (ids) => {
            await sendWspToList(ids);
            console.log("Sending Whatsapp to " + ids.length + " users");
          },
          successMessage: "Whatsapp enviado com sucesso!",
          errorMessage:
            "Erro ao enviar whatsapp! Contate o coitado do augusto.",
        },
      ],
    },
    Offers: {
      edit: {
        display: ["cluster", "shift", "spots", "duration", "station"],

        hooks: {
          beforeDb: async (row) => {
            const endTime = new Date();
            endTime.setMinutes(
              endTime.getMinutes() + Number(row.duration) || 0
            );

            return { ...row, endTime: endTime.toISOString() };
          },
        },
      },
      list: {
        filters: [
          async () => {
            const currentdate = new Date();

            return [
              {
                name: "is Active",
                active: false,
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
