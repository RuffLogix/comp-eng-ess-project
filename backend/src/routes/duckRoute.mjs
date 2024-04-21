import express from "express";
import * as duckControllers from "../controllers/duckControllers.mjs";

const router = express.Router();

router.get("/", duckControllers.getDuck);
router.put("/", duckControllers.updateDuck);
router.delete("/", duckControllers.deleteDuck);

export default router;