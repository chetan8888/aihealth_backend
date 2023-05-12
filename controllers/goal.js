const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Goal = require("../models/Goal");

exports.goal = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  console.log(userId);

  try {
    const userGoal = await Goal.findOne({ userId }).lean().exec(); // Use lean() and exec() to convert to plain JavaScript object

    if (!userGoal) {
      return res.status(404).send({ message: "User not found" });
    }

    const caloriesMappings = userGoal.caloriesMapping.map((mapping) => {
      return {
        maintainanceCalories: mapping.maintainanceCalories,
        dailyCalories: mapping.dailyCalories,
      };
    });

    res.send(caloriesMappings);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

const userCalorieHelper = async (user_id) => {
  console.log(user_id);
  const userGoal = await Goal.findOne({ userId: user_id }).lean().exec(); // Use lean() and exec() to convert to plain JavaScript object
  // console.log(userGoal)
  if (!userGoal && !userGoal.caloriesMapping) {
    return ["failure", null];
  }
  console.log("Calorie mapping user helper", userGoal.caloriesMapping);
  return [
    "success",
    {
      caloriesMappings: userGoal.caloriesMapping,
      // activtyLevel: userGoal.activity_level,
      // gender: userGoal.gender
    },
  ];
};

exports.userCalorieHelper = userCalorieHelper;

exports.getUserCalories = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;

  try {
    let [status, calories] = await userCalorieHelper(user_id);
    if (status === "success") {
      res.send(calories);
    } else {
      res.status(404).send({ message: "User Details Not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

exports.getDates = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log("userId", userId)
    const user = await Goal.findOne({userId: userId});
    console.log("user", user)
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { start_date, end_date } = user.caloriesMapping;

    return res.status(200).send({ start_date, end_date });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
