import duckModel from '../models/duckModel.mjs';

export const getScoreBoard = async (req, res) => {
    const ducks = await duckModel.find();

    ducks.sort((a, b) => b.data.level == a.data.level ? b.data.distance - a.data.distance : b.data.level - a.data.level);

    res.json(ducks);
}