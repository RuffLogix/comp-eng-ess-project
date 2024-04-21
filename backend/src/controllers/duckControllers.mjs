let ducks = {};

export const getDucks = async (req, res) => {
    res.json(ducks);
};

export const getDuck = async (req, res) => {
    const { id } = req.params;

    if (!ducks[id]) {
        res.status(404).send(`Duck ${id} not found`);
    }

    res.send(`Get Duck: ${ducks[id]}`);
};

export const createDuck = async (req, res) => {
    const { id } = req.body;

    ducks[id] = {};

    res.json("Duck Created");
};

export const updateDuck = async (req, res) => {
    const { id, duck } = req.body;

    if (!ducks[id]) {
        res.status(404).json({
            id,
            status: "error",
        });
    }

    ducks[id] = duck;

    res.json({
        id,
        duck,
        status: "success",
    });
};

export const deleteDuck = async (req, res) => {
    const { id } = req.body;
    delete ducks[id];

    res.json({
        id,
        status: "success",
    })
};