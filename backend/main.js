const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const wss = new WebSocket.Server({ port: 8080 });
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

wss.on("connection", (ws) => {
    console.log("Client connected");
});