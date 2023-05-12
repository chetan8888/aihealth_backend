const Goals = require("../models/Goal");

exports.initUserDataApi = (req, res, next) => {
  const { age, gender, height, weight, goalType, activityLevel, weeklyGoal } =
    req.body;

  const { maintenanceCalories, dailyCalories } = initUserDiet({
    gender,
    weight,
    height,
    age,
    activityLevel,
    goalType,
    weeklyGoal,
  });

  console.log(maintenanceCalories, dailyCalories);
};

initUserGoals = (userProfileData) => {};

exports.initUserProfile = (userPofileData) => {
  const { gender, weight, height, age, activityLevel, goalType, weeklyGoal } =
    userPofileData;

  console.log("userPofileData", userPofileData);
  return calculateBMR(
    gender,
    weight,
    height,
    age,
    activityLevel,
    goalType,
    weeklyGoal
  );
};

const calculateActivityLevel = (activityLevel) => {
  const activityLevels = {
    SEDENTARY: 1.2,
    "MODERATELY ACTIVE": 1.375,
    ACTIVE: 1.55,
    "VERY ACTIVE": 1.725,
  };
  return activityLevels[activityLevel] || 1.2; // default to lowest activity level if input is invalid
};

const calculateWeeklyGoalValue = (weeklyGoal) => {
  const weekly_goal_values = {
    "LOSE 0.5 POUNDS PER WEEK": -0.5,
    "LOSE 1 POUND PER WEEK (RECOMMENDED)": -1,
    "LOSE 1.5 POUNDS PER WEEK": -1.5,
    "LOSE 2 POUNDS PER WEEK": -2,
    "GAIN 0.5 POUNDS PER WEEK": 0.5,
    "GAIN 1 POUND PER WEEK (RECOMMENDED)": 1,
    "GAIN 1.5 POUNDS PER WEEK": 1.5,
    "GAIN 2 POUNDS PER WEEK": 2,
  };
  return weekly_goal_values[weeklyGoal];
};

const calculateWeeklyGoalFromgoalType = (goalType, weeklyGoal) => {
  const weeklyGoalValue = calculateWeeklyGoalValue(weeklyGoal);
  if (isNaN(weeklyGoalValue)) {
    return 0; // default to no weekly goal
  }
  switch (goalType) {
    case "LOSE WEIGHT":
      return weeklyGoalValue;
    case "GAIN WEIGHT":
      return weeklyGoalValue;
    default:
      return 0;
  }
};

const convertLbToKg = (lb) => {
  var kg = lb * 0.453592;
  return kg;
};

const calculateBMR = (
  gender,
  weight,
  height,
  age,
  activityLevel,
  goalType,
  weeklyGoal
) => {
  console.log(gender, weight, height, age, activityLevel, goalType, weeklyGoal);
  const weightKg = convertLbToKg(weight);
  const bmr =
    gender === "female"
      ? 447.6 + 9.2 * weightKg + 3.1 * height - 4.3 * age
      : 88.36 + 13.4 * weightKg + 4.8 * height - 5.7 * age;
  const maintenanceCalories = bmr * calculateActivityLevel(activityLevel);
  const dailyCalories =
    maintenanceCalories +
    (calculateWeeklyGoalFromgoalType(goalType, weeklyGoal) * 3500) / 7; // add or subtract 500 calories per day to reach weekly goal
  return { maintenanceCalories, dailyCalories };
};

exports.formatDate = (now) => {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${month}-${day}-${year}`;
  return formattedDate;
};

exports.getDateAfterSixDays = (date) => {
  const nextSixthDay = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
  const month = (nextSixthDay.getMonth() + 1).toString().padStart(2, "0");
  const day = nextSixthDay.getDate().toString().padStart(2, "0");
  const year = nextSixthDay.getFullYear().toString();
  return `${month}-${day}-${year}`;
};
