import roomModel from "../models/roomModel.mjs";
import { generateRoomId } from "../services/generateRoom.js";

export const getRoom = async (req, res) => {
    const rooms = await roomModel.find();

    res.json(rooms);
};

export const readyRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    const rooms = await roomModel.findOne({ id: roomId });

    if (rooms.length === 0) {
        status = "error";
    } else {
        rooms.players = rooms.players.map((player) => {
            if (player.username === username) {
                return {
                    ...player,
                    ready: !player.ready,
                };
            }

            return player;
        });

        await rooms.save();
    }

    res.json({ roomId, status });
};

export const createRoom = async (req, res) => {
    const { username } = req.body;
    const roomId = generateRoomId(16);

    const room = new roomModel({
        id: roomId,
        players: [{ username, ready: false }],
    });

    await room.save();

    res.json({
        roomId,
        status: "success",
    });
};

export const joinRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    const rooms = await roomModel.findOne({ id: roomId });

    if (rooms.length === 0 || rooms.players.length >= 2) {
        status = "error";
    } else {
        rooms.players.push({ username, ready: false });
        await rooms.save();
    }

    res.json({ roomId, status });
};

export const leaveRoom = async (req, res) => {
    const { username, roomId } = req.body;
    let status = "success";

    const rooms = await roomModel.findOne({ id: roomId });

    if (rooms.length === 0) {
        status = "error";
    } else {
        rooms.players = rooms.players.filter((player) => player.username !== username);
        await rooms.save();
    }

    if (rooms.players.length === 0) {
        await roomModel.deleteOne({ id: roomId });
    }

    res.json({ roomId, status });
};

export const deleteRoom = async (req, res) => {
    const { roomId } = req.body;
    let status = "success";
    const rooms = await roomModel.deleteOne({ id: roomId });

    if (rooms.deletedCount === 0) {
        status = "error";
    } 

    res.json({ roomId, status });
};