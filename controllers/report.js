const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Report = require("../models/Report");
const Goal = require("../models/Goal");
const dietLog = require("../models/DietLog");
const { ObjectId } = require("mongodb");

// Utility function to get the "fromDate" based on the given time period
function getFromDate(period) {
  const periods = {
    "last-week": 7,
    "last-month": 30,
    "last-two-months": 60,
    "last-three-months": 90,
    "last-six-months": 180,
    "last-year": 365,
  };

  const days = periods[period];
  if (!days) return null;

  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return fromDate;
}

exports.dietLogByPeriod = asyncHandler(async (req, res, next) => {
  const { userId, period } = req.body;

  const fromDate = getFromDate(period);

  if (!fromDate) {
    res.status(400).send("Invalid time period");
    return;
  }

  const pipeline = [
    {
      $match: {
        userId: userId,
        enteredDate: { $gte: fromDate },
      },
    },
    {
      $group: {
        _id: "$userId",
        reports: { $push: "$$ROOT" },
      },
    },
  ];

  try {
    const reports = await Report.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
});

exports.checkin = asyncHandler(async (req, res, next) => {
  const { weight, enteredDate, userId } = req.body;
  console.log("checkin request body:", req.body);

  try {
    const report = await Report.create({ userId, weight, enteredDate });
    console.log("checkin report created:", report);
    res.status(201).send(report);
  } catch (error) {
    console.error("checkin error:", error);
    next(error);
  }
});

exports.dietLog = asyncHandler(async (req, res, next) => {
  const { userId, dateSelected } = req.body;

  try {
    const diet = await dietLog.find({ userId: userId });
    const filteredMeals = diet.filter((obj) => {
      const id = new ObjectId(obj._id);
      const timestamp = id.getTimestamp();
      const month = String(timestamp.getMonth() + 1).padStart(2, "0");
      const date = String(timestamp.getDate()).padStart(2, "0");
      const year = timestamp.getFullYear();
      const formattedDate = `${month}/${date}/${year}`;
      return formattedDate == dateSelected;
    });

    res.status(201).send(filteredMeals);
  } catch (error) {
    console.error("checkin error:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

exports.getCalories = asyncHandler(async (req, res, next) => {
  const { userId, enteredDate } = req.body;
  try {
    const macros = await Goal.find({ userId: userId });
    const { start_date, end_date, dailyCalories, fat, carbs, protein } =
      macros[0].caloriesMapping;
    if (enteredDate >= start_date && enteredDate <= end_date) {
      res.status(200).send({ dailyCalories, fat, carbs, protein });
    }
    res
      .status(200)
      .send({ message: "No calories found for the date entered." });
  } catch (error) {
    console.error("checkin error:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
