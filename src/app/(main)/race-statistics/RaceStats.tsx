import { RaceStatsEntries, RaceStatsColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Link from "next/link";

export default function RaceStatsComponent({
  raceStats,
  raceName,
  raceId,
}: {
  raceStats: RaceStatsEntries[];
  raceName: string;
  raceId: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">{raceName}</h1>
      <DataTable columns={RaceStatsColumns} data={raceStats} />
    </div>
  );
}
