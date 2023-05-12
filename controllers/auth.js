const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Goals = require("../models/Goal");

const {
  initUserProfile,
  formatDate,
  getDateAfterSixDays,
} = require("./initUserProfile");
const { initUserDiet } = require("./initUserDiet");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    age,
    gender,
    height,
    weight,
    targetWeight,
    goalType,
    activityLevel,
    weeklyGoal,
  } = req.body;

  const user = await User.create({
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1],
    email,
    password,
    age,
    gender,
    height,
    weight,
    targetWeight,
    goalType,
    activityLevel,
    weeklyGoal,
  });

  const { maintenanceCalories, dailyCalories } = initUserProfile({
    gender,
    weight,
    height,
    age,
    activityLevel,
    goalType,
    weeklyGoal,
  });

  console.log("dailyCalories", dailyCalories);
  console.log("maintenanceCalories", maintenanceCalories);

  const calories = parseFloat(dailyCalories.toFixed(2));
  const protein = parseFloat(((0.4 * dailyCalories) / 4).toFixed(2));
  const fat = parseFloat(((0.2 * dailyCalories) / 9).toFixed(2));
  const carbs = parseFloat(((0.4 * dailyCalories) / 4).toFixed(2));

  const goal = await Goals.create({
    userId: user._id,
    email: email,
    gender: gender,
    activityLevel: activityLevel,
    currentWeight: weight,
    targetWeight: targetWeight,
    weeklyGoal: weeklyGoal,
    goalType: goalType,
    duration: "1 week",
    caloriesMapping: {
      start_date: formatDate(new Date()), // Timestamp in mm-dd-yyyy
      end_date: getDateAfterSixDays(new Date()), // Timestamp in mm-dd-yyyy
      maintenanceCalories: parseFloat(maintenanceCalories.toFixed(2)),
      maintenanceFat: parseFloat(((0.2 * maintenanceCalories) / 9).toFixed(2)),
      maintenanceCarbs: parseFloat(
        ((0.4 * maintenanceCalories) / 4).toFixed(2)
      ),
      maintenanceProtein: parseFloat(
        ((0.4 * maintenanceCalories) / 4).toFixed(2)
      ),
      dailyCalories: calories,
      fat: fat,
      carbs: carbs,
      protein: protein,
    },
  });

  // Call diet recommendation API
  const recommendationParameters = {
    calories: calories,
    protein: protein,
    fat: fat,
    sodium: 0, // Replace with calc
  };

  initUserDiet(user._id, recommendationParameters);

  // sendTokenResponse(user, 201, res);
  res.status(201).json({
    success: true,
    data: {
      user,
      goal,
    },
  });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    userId: user._id,
  });
};
