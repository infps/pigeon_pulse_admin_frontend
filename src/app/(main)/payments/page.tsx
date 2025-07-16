"use client";
import { useQueryState } from "nuqs";
import PaymentsClient from "./PaymentsClient";

export default function Page() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Payments</h1>
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <PaymentsClient />
    </div>
  );
}
