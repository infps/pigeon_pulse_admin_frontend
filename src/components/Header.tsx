"use client";
import useUserStore from "@/store/store";
import React, { useEffect, useState } from "react";
import UserControls from "./UserControls";
import Image from "next/image";

export default function Header() {
  const { userData } = useUserStore();
  const [weather, setWeather] = useState<null | {
    temp_c: number;
    temp_f: number;
    condition: string;
    icon: string;
    wind_kph: number;
    wind_mph: number;
  }>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = `https://api.weatherapi.com/v1/current.json?key=ff77f311fc10423e8c990536251207&q=${lat},${lon}&aqi=no`;

        try {
          const res = await fetch(url);
          const data = await res.json();

          setWeather({
            temp_c: data.current.temp_c,
            temp_f: data.current.temp_f,
            condition: data.current.condition.text,
            icon: data.current.condition.icon, // already contains full path except https:
            wind_kph: data.current.wind_kph,
            wind_mph: data.current.wind_mph,
          });
        } catch (error) {
          console.error("Weather fetch error:", error);
        }
      },
      (err) => {
        console.error("Location permission denied:", err);
      }
    );
  }, []);

  return (
    <div className="h-24 flex bg-card z-50 gap-20 items-center justify-between px-6 shadow-2xl sticky top-0 left-0">
      <div>
        <p className="text-2xl font-bold text-nowrap text-black">
          Welcome, {userData?.user?.name}
        </p>
        <p className="text-sm text-accent-foreground text-nowrap flex items-center gap-4">
          <span>
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        {weather && (
          <div className="flex items-center gap-2">
            <Image
              width={24}
              height={24}
              src={`https:${weather.icon}`}
              alt={weather.condition}
              className="w-6 h-6"
            />
            <span className="text-muted-foreground">
              {weather.temp_c}°C / {weather.temp_f}°F
            </span>
            <span className="text-muted-foreground">
              | Wind: {weather.wind_kph} km/h ({weather.wind_mph} mph)
            </span>
          </div>
        )}

        <UserControls />
      </div>
    </div>
  );
}
