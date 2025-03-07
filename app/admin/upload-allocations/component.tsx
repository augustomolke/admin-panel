"use client";
import XLSXFileInput from "@/components/fileinput";
import { createManyAllocations } from "@/db/allocations";

export function Component() {
  return (
    <section className="w-lg">
      <header className="flex justify-center font-semibold text-2xl">
        Upload Allocations
      </header>

      <div className="flex w-screen h-screen items-center justify-center">
        <XLSXFileInput onSubmit={createManyAllocations} />
      </div>
    </section>
  );
}
