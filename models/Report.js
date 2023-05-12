const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please add user id"],
  },
  weight: {
    type: Number,
    unique: false,
  },
  enteredDate: {
    type: String,
    // default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
