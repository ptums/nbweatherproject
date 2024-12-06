import { WeatherQueries } from "@prisma/client";
import {
  WeatherQueriesRepository,
  WeatherQueriesWithRelations,
} from "../../repository";

export async function createWeatherQuery(
  queryData: Omit<WeatherQueries, "id">
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.create(queryData);
  } catch (error) {
    console.error("Error creating weather query:", error);
    return null;
  }
}

export async function findWeatherQueryById(
  id: number
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.findById(id);
  } catch (error) {
    console.error(`Error finding weather query with id ${id}:`, error);
    return null;
  }
}

export async function findWeatherQueriesByUniqueId(
  uniqueId: string
): Promise<WeatherQueriesWithRelations[]> {
  try {
    return await WeatherQueriesRepository.findByUniqueId(uniqueId);
  } catch (error) {
    console.error(`Error finding weather queries for user ${uniqueId}:`, error);
    return [];
  }
}

export async function updateWeatherQuery(
  id: number,
  queryData: Partial<Omit<WeatherQueries, "id">>
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.update(id, queryData);
  } catch (error) {
    console.error(`Error updating weather query ${id}:`, error);
    return null;
  }
}

export async function deleteWeatherQuery(id: number): Promise<boolean> {
  try {
    await WeatherQueriesRepository.deleteById(id);
    return true;
  } catch (error) {
    console.error(`Error deleting weather query ${id}:`, error);
    return false;
  }
}

export async function getAllWeatherQueries(): Promise<
  WeatherQueriesWithRelations[]
> {
  try {
    return await WeatherQueriesRepository.findAll();
  } catch (error) {
    console.error("Error fetching all weather queries:", error);
    return [];
  }
}

export async function addUserToWeatherQuery(
  id: number,
  uniqueId: string
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.addUserToQuery(id, uniqueId);
  } catch (error) {
    console.error(`Error adding user ${uniqueId} to query ${id}:`, error);
    return null;
  }
}

export async function removeUserFromWeatherQuery(
  id: number,
  uniqueId: string
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.removeUserFromQuery(id, uniqueId);
  } catch (error) {
    console.error(`Error removing user ${uniqueId} from query ${id}:`, error);
    return null;
  }
}

export async function findWeatherQueriesByQueryString(
  query: string
): Promise<WeatherQueriesWithRelations | null> {
  try {
    return await WeatherQueriesRepository.findByQuery(query);
  } catch (error) {
    console.error(`Error finding weather queries matching "${query}":`, error);
    return null;
  }
}

export async function weatherQueryExists(id: number): Promise<boolean> {
  try {
    return await WeatherQueriesRepository.existsById(id);
  } catch (error) {
    console.error(`Error checking existence of weather query ${id}:`, error);
    return false;
  }
}

export async function userWeatherQueryExists(
  queryId: number,
  userId: string
): Promise<boolean> {
  try {
    return await WeatherQueriesRepository.existsUser(queryId, userId);
  } catch (error) {
    console.error(
      `Error checking existence of weather queryId ${queryId}, userId ${userId}:`,
      error
    );
    return false;
  }
}
