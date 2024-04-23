import mongoose from "mongoose";

const duckSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
    }, 
    players: {
        type: Array,
        require: true,
    }
});

export default mongoose.model("Duck", duckSchema);