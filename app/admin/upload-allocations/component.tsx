"use client";
import XLSXFileInput from "@/components/fileinput";
import { createManyAllocations } from "@/db/allocations";

export function Component() {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <XLSXFileInput onSubmit={createManyAllocations} />
    </div>
  );
}
