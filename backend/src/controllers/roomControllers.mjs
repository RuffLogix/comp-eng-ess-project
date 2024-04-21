import { generateRoomId } from "../services/generateRoom.js";

const rooms = {};

export const getRoom = async (req, res) => {
    res.json(rooms);
};

export const readyRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    if (!rooms[roomId]) {
        status = "error";
    } else {
        rooms[roomId].players = rooms[roomId].players.map((player) => {
            if (player.username === username) {
                return {
                    ...player,
                    ready: !player.ready,
                };
            }

            return player;
        });
    }

    res.json({ roomId, status });
};

export const createRoom = async (req, res) => {
    const { username } = req.body;
    const roomId = generateRoomId(16);

    rooms[roomId] = {
        players: [{ username, ready: false }],
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
        rooms[roomId].players.push({ username, ready: false });
    }

    res.json({ roomId, status });
};

export const leaveRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    if (!rooms[roomId]) {
        status = "error";
    } else {
        rooms[roomId].players = rooms[roomId].players.filter((player) => player.username !== username);
    }

    if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
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