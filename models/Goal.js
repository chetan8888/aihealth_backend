const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please add userId"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add email"],
  },
  currentWeight: {
    type: Number,
    required: true,
  },
  targetWeight: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  },
  caloriesMapping: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("Goal", GoalSchema);
