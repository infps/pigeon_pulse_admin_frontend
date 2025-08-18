"use client";
import BreedersTable, { BreederSearch } from "./client";

export default function page() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Breeders Address Book</h1>
        <BreederSearch />
      </div>
      <BreedersTable />
    </div>
  );
}
