import { RaceStatsEntries, RaceStatsColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/Pagination";

export default function RaceStatsComponent({
  raceStats,
  pagination,
}: {
  raceStats: RaceStatsEntries[];
  raceName?: string;
  raceId?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}) {
  return (
    <div>
      <DataTable columns={RaceStatsColumns} data={raceStats} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
