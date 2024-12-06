import express, { Request, Response } from "express";

import {
  createWeatherData,
  getAllWeatherData,
  findWeatherDataById,
  findWeatherDataByQueryId,
} from "./methods/weatherData";
import { WeatherData } from "@prisma/client";
import { fetchWeatherData, mapWeatherCode } from "../utils";
import {
  addUserToWeatherQuery,
  createUser,
  createWeatherQuery,
  findUserByUniqueId,
  findWeatherQueriesByQueryString,
  userWeatherQueryExists,
} from "./methods";

const router = express.Router();

// create new weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    const { query }: { query: Omit<WeatherData, "id"> } = req.body;
    const createdData = await createWeatherData(query);
    res.status(201).json(createdData);
  } catch (error) {
    res.status(400).json({ error: "Unable to create weather data" });
  }
});

// Create fetched weather data
router.post("/fetch-weather", async (req: Request, res: Response) => {
  try {
    const { query, uniqueId } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query parameter" });
    }

    const findUser = await findUserByUniqueId(uniqueId);
    let currentUniqueId = uniqueId;

    // Step 1: Find or create WeatherQuery
    let weatherQuery = await findWeatherQueriesByQueryString(query);

    if (!weatherQuery) {
      weatherQuery = await createWeatherQuery({ query });
    }

    const queryId = weatherQuery?.id;

    // Step 2: Add user to create if its needs
    if (!findUser) {
      const userQuery = await createUser({
        uniqueId: currentUniqueId,
      });

      await addUserToWeatherQuery(
        queryId as number,
        userQuery?.uniqueId as string
      );

      currentUniqueId = userQuery?.uniqueId;
    } else {
      const existsUser = await userWeatherQueryExists(
        queryId as number,
        currentUniqueId
      );

      if (!existsUser) {
        await addUserToWeatherQuery(queryId as number, findUser.uniqueId);
      }
    }

    if (queryId) {
      // Step 3: Check for existing WeatherData
      const existingWeatherData = await findWeatherDataByQueryId(queryId);

      if (existingWeatherData && existingWeatherData.length > 0) {
        return res.status(200).json(existingWeatherData);
      }

      // Step 4: Fetch new weather data
      const [month, year] = query.split("-").map(Number);

      if (isNaN(month) || isNaN(year)) {
        return res.status(400).json({ error: "Invalid query format" });
      }

      const fetchedData = await fetchWeatherData(month, year);

      // Step 5: Create new WeatherData entries
      const newWeatherData = await Promise.all(
        fetchedData.daily.time.map(async (date, index) => {
          return createWeatherData({
            queryId,
            date: new Date(date),
            highTemp: fetchedData.daily.temperature_2m_max[index],
            lowTemp: fetchedData.daily.temperature_2m_min[index],
            weather: mapWeatherCode(fetchedData.daily.weathercode[index]),
            windSpeed: fetchedData.daily.windspeed_10m_max[index],
          });
        })
      );

      res.status(201).json(newWeatherData);
    }
  } catch (error) {
    console.error("Error in create-fetched-weather:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get individual weather record
router.get("/i/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const weatherDataList = await findWeatherDataById(id);

    if (!weatherDataList) {
      return res.status(404).json({ error: "Weather data not found" });
    }

    res.status(200).json(weatherDataList);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all weather data records by query id
router.get("/i/q/:queryId", async (req: Request, res: Response) => {
  try {
    const queryId = parseInt(req.params.queryId, 10);

    if (isNaN(queryId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const weatherDataList = await findWeatherDataByQueryId(queryId);

    if (!weatherDataList) {
      return res.status(404).json({ error: "Weather data not found" });
    }

    res.status(200).json(weatherDataList);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const allData = await getAllWeatherData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
