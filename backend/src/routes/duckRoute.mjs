import express from "express";
import * as duckControllers from "../controllers/duckControllers.mjs";

const router = express.Router();

router.get("/", duckControllers.getDucks);
router.get("/scoreboard", duckControllers.getScoreBoard);
router.post("/create", duckControllers.createDuck);
router.put("/", duckControllers.updateDuck);
router.delete("/", duckControllers.deleteDuck);

export default router;