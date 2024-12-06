import express from "express";
import weatherQueriesRouter from "./weatherQueries";
import weatherDataRouter from "./weatherData";
import weatherUserRouter from "./weatherUsers";

const router = express.Router();

router.use("/wq", weatherQueriesRouter);
router.use("/wd", weatherDataRouter);
router.use("/wu", weatherUserRouter);

export default router;
