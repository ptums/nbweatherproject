import axios from "axios";

const LATITUDE = 40.4862;
const LONGITUDE = -74.4518;
const BASE_URL_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";
const BASE_URL_FORECAST = "https://api.open-meteo.com/v1/forecast";

export interface OpenMeteoData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  weathercode: string;
  windspeed_10m_max: string;
}

export interface Daily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  windspeed_10m_max: number[];
}

export async function fetchWeatherData(
  month: number,
  year: number
): Promise<OpenMeteoData> {
  try {
    const url = buildUrl(month, year);
    console.log("API URL:", url);
    const response = await axios.get<OpenMeteoData>(url);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}

function buildUrl(month: number, year: number): string {
  const currentDate = new Date();
  const requestedDate = new Date(year, month - 1, 1);
  const startDate = requestedDate.toISOString().split("T")[0];

  let endDate: string;
  if (
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === month - 1
  ) {
    console.debug("Current month requested");
    endDate = currentDate.toISOString().split("T")[0];
  } else {
    console.debug("Past month requested");
    endDate = new Date(year, month, 0).toISOString().split("T")[0];
  }

  const baseUrl =
    endDate === currentDate.toISOString().split("T")[0]
      ? BASE_URL_FORECAST
      : BASE_URL_ARCHIVE;

  return (
    `${baseUrl}?latitude=${LATITUDE}&longitude=${LONGITUDE}&start_date=${startDate}&end_date=${endDate}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max` +
    `&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`
  );
}
