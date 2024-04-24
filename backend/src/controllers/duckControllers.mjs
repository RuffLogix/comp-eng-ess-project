import duckModel from "../models/duckModel.mjs";
import roomModel from "../models/roomModel.mjs";

export const getDucks = async (req, res) => {
    const ducks = await duckModel.find();

    res.json(ducks);
};

export const getDuck = async (req, res) => {
    const { id } = req.params;

    res.send(`Get Duck: ${ducks[id]}`);
};

export const createDuck = async (req, res) => {
    const { id, duck } = req.body;
    
    const room = await roomModel.findOne({ id: id });
    const checkDuck = await duckModel.findOne({ id: id });

    if (!room) {
        return res.json({ status: "error", message: "Duck already exists" });
    } 

    if (checkDuck) {
        const duckData = checkDuck.data;
        return res.json({ status: "load", players: room.players, duck: duckData })
    }

    const newDuck = new duckModel({
        id,
        players: room.players,
        data: duck,
    }); 

    await newDuck.save();

    res.json({ status: "success", players: room.players });
};

export const updateDuck = async (req, res) => {
    const { id, duck } = req.body;

    await duckModel.findOneAndUpdate({ id: id }, { data: duck }, { new: true });

    res.json({
        status: "success",
    });
};

export const deleteDuck = async (req, res) => {
    const { id } = req.body;



    res.json({ status: "success"})
};

export const getScoreBoard = async (req, res) => {
    const ducks = await duckModel.find();
    while(ducks.length > 3){
        ducks.pop();
    }
    ducks.sort((a, b) => b.data.level == a.data.level ? b.data.distance - a.data.distance : b.data.level - a.data.level);

    res.json(ducks);
};