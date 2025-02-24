"use client";

import { Button } from "@/components/ui/button";
import { sendWspToList } from "@/lib/noti";
import { ClientActionDialogContentProps } from "@premieroctet/next-admin";

type Props = ClientActionDialogContentProps<"Offers">;

export function ConfirmationDialog(props: Props) {
  const { data, resourceIds, onClose } = props;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div>{`CRIAR TASK NO NOTI`} </div>

      <div>
        <Button
          onClick={async () => {
            if (onClose) {
              onClose();
            }
            // await sendWspToList(resourceIds);
          }}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
