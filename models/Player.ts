import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: String,
    grade: String,
    height: String,
    weight: String,
    wingspan: String,
    position: String,
    jerseyNumber: String,
    team: String,
    // Physical stats
    verticalJump: Number,
    laneAgility: Number,
    sprintSpeed: Number,
}, {
    timestamps: true,
});

export default mongoose.models.Player || mongoose.model("Player", playerSchema);
