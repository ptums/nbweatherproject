import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";
import cors from "cors";

import path from "path";

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true,
};

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
