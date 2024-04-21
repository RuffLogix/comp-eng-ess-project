import express from "express";
import * as roomControllers from "../controllers/roomControllers.mjs";

const router = express.Router();

router.get("/", roomControllers.getRoom);
router.post("/ready", roomControllers.readyRoom);
router.post("/create", roomControllers.createRoom);
router.post("/join", roomControllers.joinRoom);
router.post("/leave", roomControllers.leaveRoom);
router.delete("/", roomControllers.deleteRoom);

export default router;