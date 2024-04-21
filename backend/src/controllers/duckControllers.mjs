export const getDucks = async (req, res) => {
    res.send("Get Ducks");
};

export const getDuck = async (req, res) => {
    const { id } = req.params;
    res.send(`Get Duck: ${id}`);
};

export const updateDuck = async (req, res) => {
    res.send("Update Duck");
};

export const deleteDuck = async (req, res) => {
    res.send("Delete Duck");
};