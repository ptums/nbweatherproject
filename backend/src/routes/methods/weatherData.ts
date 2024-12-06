import { WeatherData } from "@prisma/client";
import { WeatherDataRepository } from "../../repository";

export async function createWeatherData(
  weatherData: Omit<WeatherData, "id">
): Promise<WeatherData | null> {
  try {
    return await WeatherDataRepository.create(weatherData);
  } catch (error) {
    console.error("Error creating weather data:", error);
    return null;
  }
}

export async function findWeatherDataById(
  id: number
): Promise<WeatherData | null> {
  try {
    return await WeatherDataRepository.findById(id);
  } catch (error) {
    console.error(`Error finding weather data with id ${id}:`, error);
    return null;
  }
}

export async function findWeatherDataByQueryId(
  queryId: number
): Promise<WeatherData[]> {
  try {
    return await WeatherDataRepository.findByQueryId(queryId);
  } catch (error) {
    console.error(`Error finding weather data for query ${queryId}:`, error);
    return [];
  }
}

export async function updateWeatherData(
  id: number,
  weatherData: Partial<Omit<WeatherData, "id">>
): Promise<WeatherData | null> {
  try {
    return await WeatherDataRepository.update(id, weatherData);
  } catch (error) {
    console.error(`Error updating weather data ${id}:`, error);
    return null;
  }
}

export async function deleteWeatherData(id: number): Promise<boolean> {
  try {
    await WeatherDataRepository.deleteById(id);
    return true;
  } catch (error) {
    console.error(`Error deleting weather data ${id}:`, error);
    return false;
  }
}

export async function getAllWeatherData(): Promise<WeatherData[]> {
  try {
    return await WeatherDataRepository.findAll();
  } catch (error) {
    console.error("Error fetching all weather data:", error);
    return [];
  }
}

export async function findWeatherDataByDateRange(
  startDate: Date,
  endDate: Date
): Promise<WeatherData[]> {
  try {
    return await WeatherDataRepository.findByDateRange(startDate, endDate);
  } catch (error) {
    console.error(
      `Error finding weather data between ${startDate} and ${endDate}:`,
      error
    );
    return [];
  }
}

export async function weatherDataExists(id: number): Promise<boolean> {
  try {
    return await WeatherDataRepository.existsById(id);
  } catch (error) {
    console.error(`Error checking existence of weather data ${id}:`, error);
    return false;
  }
}
