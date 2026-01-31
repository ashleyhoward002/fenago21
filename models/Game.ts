import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    opponent: {
      type: String,
      required: true,
    },
    homeAway: {
      type: String,
      enum: ["H", "A"],
      default: "H",
    },
    // Basic Stats
    minutes: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    
    // Shooting
    fgMade: { type: Number, default: 0 },
    fgAttempted: { type: Number, default: 0 },
    threeMade: { type: Number, default: 0 },
    threeAttempted: { type: Number, default: 0 },
    ftMade: { type: Number, default: 0 },
    ftAttempted: { type: Number, default: 0 },
    
    // Rebounds
    offRebounds: { type: Number, default: 0 },
    defRebounds: { type: Number, default: 0 },
    totalRebounds: { type: Number, default: 0 },
    
    // Other Stats
    assists: { type: Number, default: 0 },
    steals: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    turnovers: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    plusMinus: { type: Number, default: 0 },
    
    // Calculated Fields (stored for performance)
    fgPercentage: { type: Number },
    threePercentage: { type: Number },
    ftPercentage: { type: Number },
    
    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Calculate percentages before saving
gameSchema.pre("save", function (next) {
  // Calculate total rebounds
  this.totalRebounds = this.offRebounds + this.defRebounds;
  
  // Calculate shooting percentages
  this.fgPercentage = this.fgAttempted > 0 ? (this.fgMade / this.fgAttempted) * 100 : 0;
  this.threePercentage = this.threeAttempted > 0 ? (this.threeMade / this.threeAttempted) * 100 : 0;
  this.ftPercentage = this.ftAttempted > 0 ? (this.ftMade / this.ftAttempted) * 100 : 0;
  
  next();
});

// Indexes for efficient queries
gameSchema.index({ userId: 1, date: -1 });
gameSchema.index({ playerId: 1, date: -1 });

export default mongoose.models.Game || mongoose.model("Game", gameSchema);
