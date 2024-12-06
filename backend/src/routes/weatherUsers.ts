import express, { Request, Response } from "express";
import { getAllWeatherQueries } from "./methods/weatherQueries";

const router = express.Router();

// Get all weather queries
router.get("/", async (_req: Request, res: Response) => {
  try {
    const queries = await getAllWeatherQueries();
    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching all weather queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
