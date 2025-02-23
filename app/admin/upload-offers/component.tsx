"use client";
import XLSXFileInput from "@/components/fileinput";
import { createManyOffers } from "@/db/offers";

export function Component() {
  return (
    <section className="w-lg">
      <header className="flex justify-center font-semibold text-2xl">
        Upload Clusters to Crowdsourcing
      </header>
      <div className="flex w-screen h-screen items-center justify-center">
        <XLSXFileInput onSubmit={createManyOffers} />
      </div>
    </section>
  );
}
