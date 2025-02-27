"use client";

import { Button } from "@/components/ui/button";
import { sendWspToList } from "@/lib/noti";
import { sendCrowdSourcingWsp } from "@/lib/noti";
import { ClientActionDialogContentProps } from "@premieroctet/next-admin";

type Props = ClientActionDialogContentProps<"Offers">;

export default function ConfirmationDialog(props: Props) {
  const { data, resourceIds, onClose } = props;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div>Confirmar disparo para TODOS OS MOTORISTAS ATIVOS deste hub?</div>

      <div>
        <Button
          onClick={async () => {
            if (onClose) {
              onClose();
            }
            await sendCrowdSourcingWsp(resourceIds);
            // await sendWspToList(resourceIds);
          }}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
