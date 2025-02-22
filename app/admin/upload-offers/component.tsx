"use client";
import XLSXFileInput from "@/components/fileinput";
import { createManyOffers } from "@/db/offers";

export function Component() {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <XLSXFileInput onSubmit={createManyOffers} />
    </div>
  );
}
