const mongoose = require("mongoose");

const DietLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: false,
    required: [true, "Please add user id"],
  },
  servings: {
    type: Number,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  data: {
    type: JSON,
    required: true,
  },
});

module.exports = mongoose.model("DietLog", DietLogSchema);
