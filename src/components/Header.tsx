"use client";
import useUserStore from "@/store/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UserControls from "./UserControls";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Header() {
  const { userData } = useUserStore();
  const [weather, setWeather] = useState<
    | {
        date: string;
        maxtemp_c: number;
        mintemp_c: number;
        condition: string;
        icon: string;
      }[]
    | null
  >(null);
  const [foreCastDay, setForeCastDay] = useState<string>("1");
  const weatherCacheRef = useRef<Record<string, any>>({});
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const fetchWeatherData = useCallback(
    async (lat: number, lon: number, days: string) => {
      // Create cache key for location and forecast days
      const cacheKey = `${lat}-${lon}-${days}`;

      // Check if we have cached data for this combination
      if (weatherCacheRef.current[cacheKey]) {
        console.log(
          "Using cached weather data:",
          weatherCacheRef.current[cacheKey]
        );
        setWeather(weatherCacheRef.current[cacheKey]);
        return;
      }

      const url = `https://api.weatherapi.com/v1/forecast.json?key=ff77f311fc10423e8c990536251207&q=${lat},${lon}&days=${Number(
        days
      )}&aqi=no&alerts=no`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const weatherReport = data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxtemp_c: day.day.maxtemp_c,
          mintemp_c: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
        }));
        console.log("Weather data fetched from API:", weatherReport);

        // Cache the response
        weatherCacheRef.current[cacheKey] = weatherReport;

        setWeather(weatherReport);
      } catch (error) {
        console.error("Weather fetch error:", error);
      }
    },
    []
  );

  // Effect to get user's location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCurrentLocation({ lat, lon });
      },
      (err) => {
        console.error("Location permission denied:", err);
      }
    );
  }, []);

  // Effect to fetch weather data when location or forecast days change
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData(currentLocation.lat, currentLocation.lon, foreCastDay);
    }
  }, [currentLocation, foreCastDay, fetchWeatherData]);

  const WeatherWidget = ({ className = "" }: { className?: string }) => {
    if (!weather) return null;

    return (
      <div className="flex items-center gap-4">
        {weather.map((day) => (
          <div
            key={day.date}
            className={`flex flex-col items-center ${className}`}
          >
            <Image
              src={`https:${day.icon}`}
              alt={day.condition}
              width={32}
              height={32}
            />
            <span className="text-xs text-gray-500">
              {day.maxtemp_c}°C / {day.mintemp_c}°C
            </span>
            <span className="text-sm font-medium">{day.date}</span>
          </div>
        ))}
      </div>
    );
  };

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
        <WeatherWidget />
        <Select value={foreCastDay} onValueChange={setForeCastDay}>
          <SelectTrigger className="border rounded-lg px-3 py-2">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Day</SelectItem>
            <SelectItem value="3">3 Days</SelectItem>
          </SelectContent>
        </Select>
        <UserControls />
      </div>
    </div>
  );
}
