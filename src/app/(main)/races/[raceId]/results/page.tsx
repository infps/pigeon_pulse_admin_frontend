"use client";
import { RaceResultColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/loading-skeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetRace,
  useListRaceResults,
  usePublishRaceResult,
} from "@/lib/api/races";
import { Race, RaceResult } from "@/lib/types";
import {
  CalendarIcon,
  MapPinIcon,
  SunriseIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import { toast } from "sonner";

export default function page() {
  const params = useParams<{ raceId: string }>();
  const raceId = params.raceId;

  if (!raceId) {
    return <div className="text-red-500">Invalid race ID</div>;
  }

  return (
    <>
      <RaceDetails raceId={raceId} />
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-4">Race Entries</h2>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Start Scanner</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm max-h-[80vh] overflow-y-auto">
                <PublishResult raceId={raceId} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <RaceResults raceId={raceId} />
      </div>
    </>
  );
}
function PublishResult({ raceId }: { raceId: string }) {
  const { mutateAsync: publishResult } = usePublishRaceResult(parseInt(raceId));
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    if (!publishResult) return;
    e.preventDefault();
    if (!ref.current) return;
    const rfId = ref.current.value;
    try {
      const { data, error } = await publishResult({ rfId });
      if (error) {
        toast.error(`Error: ${error}`);
      } else {
        toast.success("Bird scanned successfully!");
      }
      ref.current.value = "";
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Race Scanning</DialogTitle>
        <DialogDescription>Scan the RFID of the bird</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="rfId">RFID</Label>
          <Input ref={ref} id="rfId" name="rfId" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit} type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
function RaceDetails({ raceId }: { raceId: string }) {
  const { data, error, isError, isPending } = useGetRace(parseInt(raceId));

  if (isPending) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load race details</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const race: Race = data.data;

  const formatDateTime = (dateString: string | null) => {
    return new Date(dateString || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string | null) => {
    return new Date(dateString || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeLabel = (type: number | null) => {
    const typeLabels: Record<string, string> = {
      1: "Training",
      2: "Inventory",
      3: "Loft Fly",
      4: "Pulling Flight",
      5: "Final Race",
      6: "Hotspot 1",
      7: "Hotspot 2",
      8: "Hotspot 3",
      9: "Average Winner",
    };
    return type ? typeLabels[type] : "Training"
  };

  const getStatusBadge = (isClosed: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isClosed
            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        }`}
      >
        {isClosed ? "Closed" : "Open"}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Race #{race.raceNumber}</h1>
          <p className="text-muted-foreground">Race Details and Results</p>
        </div>
        {getStatusBadge(race.isClosed === 1 ? true: false)}
      </div>

      {/* Basic Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <MapPinIcon className="h-5 w-5" />
              Basic Information
            </div>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Type
              </label>
              <p className="text-lg">{getTypeLabel(race.idRaceType)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Location
              </label>
              <p className="text-lg">{race.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Distance
              </label>
              <p className="text-lg">{race.distance} miles</p>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <CalendarIcon className="h-5 w-5" />
              Schedule
            </div>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Start Time
              </label>
              <p className="text-lg">{formatDateTime(race.startTime)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Arrival Date
              </label>
              <p className="text-lg">{formatDate(race.endTime)}</p>
            </div>
          </div>
        </div>

        {/* Sun Times Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <SunriseIcon className="h-5 w-5" />
              Sun Times
            </div>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Sunrise
              </label>
              <p className="text-lg">{race.sunrise || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Sunset
              </label>
              <p className="text-lg">{race.sunset || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Information */}
      {(race.weather ||
        race.wind ||
        race.temperature ||
        race.arrivalWeather ||
        race.arrivalWind ||
        race.arrivalTemperature) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liberation Weather */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <ThermometerIcon className="h-5 w-5" />
                Liberation Weather
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Weather
                </label>
                <p className="text-lg">{race.weather || "Not recorded"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Temperature
                </label>
                <p className="text-lg">{race.temperature || "Not recorded"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Wind
                </label>
                <p className="text-lg">{race.wind || "Not recorded"}</p>
              </div>
            </div>
          </div>

          {/* Arrival Weather */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <WindIcon className="h-5 w-5" />
                Arrival Weather
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Weather
                </label>
                <p className="text-lg">
                  {race.arrivalWeather || "Not recorded"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Temperature
                </label>
                <p className="text-lg">
                  {race.arrivalTemperature || "Not recorded"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Wind
                </label>
                <p className="text-lg">{race.arrivalWind || "Not recorded"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RaceResults({ raceId }: { raceId: string }) {
  const { data, error, isError, isPending } = useListRaceResults(parseInt(raceId));
  const results: RaceResult[] = data?.data || [];
  
  if (isPending) {
    return <TableSkeleton rows={8} columns={6} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load race results</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  
  return <DataTable columns={RaceResultColumns} data={results} />;
}
