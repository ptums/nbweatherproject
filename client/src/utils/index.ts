import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CompareWeatherData, FormattedChartData, WeatherData } from "./types";

const currentDate = new Date();
export const currentMonth = currentDate.getMonth();
export const defaultYear = currentDate.getFullYear();
export const defaultMonth = (currentMonth + 1).toString();
export const day = currentDate.getDate();

export const localDate =
  `${defaultMonth}${day}${defaultYear}`.toLocaleLowerCase();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthName(monthNumber: number): string {
  // Adjust for 0-based index and handle out-of-range values
  const index = (((monthNumber - 1) % 12) + 12) % 12;
  return months[index];
}

export function formatCompareWeatherData(
  compareWeatherData: CompareWeatherData[]
): FormattedChartData[] {
  if (compareWeatherData.length === 0) return [];

  // Find the dataset with the most data points
  const maxDataPoints = Math.max(
    ...compareWeatherData.map((data) => data.weatherData.length)
  );

  // Create an array of dates based on the dataset with the most points
  const dates = compareWeatherData[0].weatherData
    .map((data) => data.date)
    .slice(0, maxDataPoints);

  return dates.map((date, index) => {
    const dataPoint: FormattedChartData = { date };

    compareWeatherData.forEach((data) => {
      const monthName = getMonthName(data.month);
      const year = data.year;
      const key = `${monthName}${year}`;

      // High temperature
      dataPoint[`${key}High`] = data.weatherData[index]?.highTemp ?? null;

      // Low temperature
      dataPoint[`${key}Low`] = data.weatherData[index]?.lowTemp ?? null;

      // Day
      dataPoint["day"] = new Date(data.weatherData[index]?.date)
        .getUTCDate()
        .toString();

      // Average temperature (for simplicity in the chart)
      const highTemp = data.weatherData[index]?.highTemp;
      const lowTemp = data.weatherData[index]?.lowTemp;
      if (highTemp !== undefined && lowTemp !== undefined) {
        dataPoint[`${key}Avg`] = (highTemp + lowTemp) / 2;
      } else {
        dataPoint[`${key}Avg`] = null;
      }
    });

    return dataPoint;
  });
}

export function buildComparionList(
  weatherData: WeatherData[],
  query: string
): CompareWeatherData {
  const [month, year] = query.split("-").map(Number);
  const id = Date.now().toString();

  return {
    id,
    month,
    year,
    query,
    weatherData,
  };
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export const sortByDate = (data: WeatherData[]) => {
  return data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));
};
