import express from "express";
import * as roomControllers from "../controllers/roomControllers.mjs";

const router = express.Router();

router.get("/", roomControllers.getRoom);
router.post("/create", roomControllers.createRoom);
router.post("/join", roomControllers.joinRoom);
router.delete("/", roomControllers.deleteRoom);

export default router;