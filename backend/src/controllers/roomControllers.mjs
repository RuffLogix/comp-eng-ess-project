import { generateRoomId } from "../services/generateRoom.js";

const rooms = {};

export const getRoom = async (req, res) => {
    res.json(rooms);
};

export const createRoom = async (req, res) => {
    const { username } = req.body;
    const roomId = generateRoomId(16);

    rooms[roomId] = {
        players: [username],
    }

    res.json({
        roomId,
        status: "success",
    });
};

export const joinRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    if (!rooms[roomId] || rooms[roomId].players.length >= 2) {
        status = "error";
    } else {
        rooms[roomId].players.push(username);
    }

    res.json({ roomId, status });
};

export const deleteRoom = async (req, res) => {
    const { roomId } = req.body;
    delete rooms[roomId];

    res.json({
        roomId,
        status: "success",
    });
};