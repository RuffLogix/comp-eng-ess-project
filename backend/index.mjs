import "dotenv/config"
import "./src/config/db.mjs";

import express from "express";
import cors from "cors";

const app = express();
import duckRoute from "./src/routes/duckRoute.mjs";
import roomRoute from "./src/routes/roomRoute.mjs";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/duck", duckRoute);
app.use("/api/room", roomRoute);

app.listen(3222, () => {
    console.log("Server is running on port 3222");
});