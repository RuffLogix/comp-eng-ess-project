import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
    }, 
    players: {
        type: Array,
        require: true,
    }, 
    status: {
        type: Boolean,
        require: true,
    }
});

export default mongoose.model("Room", roomSchema);