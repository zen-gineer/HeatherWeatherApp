"use client";

import Container from "@/components/container";
import Navbar from "@/components/navbar";
import WeatherIcon from "@/components/weathericon";
import convertKelvinToFahrenheit from "@/utils/convertKelvinToFahrenheit";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import axios from "axios";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";
import { useQuery } from "react-query";

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: City;
};

type WeatherForecast = {
  dt: number;
  main: MainWeather;
  weather: WeatherDetail[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
};

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type WeatherDetail = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Sys = {
  pod: string;
};

type City = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export default function Home() {
  const { isLoading, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=austin&appid=c916397ae23a8b94617bb71f306e05fc&cnt=56`
      );
      return data;
    }
  );

  const firstData = data?.list[0];

  console.log("data", data);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "PP")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToFahrenheit(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-sx-1 whitespace-nowrap">
                  <span>Feels like </span>
                  <span className="text-1xl">
                    {convertKelvinToFahrenheit(firstData?.main.feels_like ?? 0)}
                    °
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToFahrenheit(firstData?.main.temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToFahrenheit(firstData?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
              {/* temperature */}
              <div className="flex flex-col px-4"></div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>
                    {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                    <p className="text-lg">
                      {convertKelvinToFahrenheit(d?.main.temp ?? 0)}°
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/* 7 day forecast data */}
        <section></section>
      </main>
    </div>
  );
}
