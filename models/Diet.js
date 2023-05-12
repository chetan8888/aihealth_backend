const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please add user id"],
  },
  assignedDishes: {
    type: Object,
    unique: false,
    required: false
  }
});

module.exports = mongoose.model('Diet', DietSchema);