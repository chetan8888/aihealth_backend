const asyncHandler = require("../middleware/async");
const DietLog = require("../models/DietLog");
const Diet = require("../models/Diet");
const { readOnly } = require("./db");

const convertObjectIdToDate = (objectId) => {
  const timestamp = objectId.getTimestamp();

  const dateObj = new Date(timestamp);
  const dayOfMonth = dateObj.getDate() + 1;
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const formattedDate = `${year}/${month}/${dayOfMonth}`;
  return formattedDate;
};

function getNutritionInfo(data) {
  const { label, yield, calories } = data;
  const { ENERC_KCAL, FAT, CHOCDF, PROCNT } = data.totalNutrients;

  return {
    label,
    yield,
    calories,
    ENERC_KCAL,
    FAT,
    CHOCDF,
    PROCNT,
  };
}

function calculateNutrients(data) {
  // Extract the relevant information from the data object
  const updatedData = data.map((item) => {
    const {
      servings,
      mealType,
      data: {
        label,
        yield: originalYield,
        calories,
        ENERC_KCAL,
        FAT,
        CHOCDF,
        PROCNT,
      },
    } = item;

    // Calculate the actual yield based on the provided servings
    const actualYield = servings / originalYield;

    // Calculate the actual nutrients based on the actual yield
    const actualNutrients = {
      ENERC_KCAL: {
        ...ENERC_KCAL,
        quantity: ENERC_KCAL.quantity * actualYield,
      },
      FAT: {
        ...FAT,
        quantity: FAT.quantity * actualYield,
      },
      CHOCDF: {
        ...CHOCDF,
        quantity: CHOCDF.quantity * actualYield,
      },
      PROCNT: {
        ...PROCNT,
        quantity: PROCNT.quantity * actualYield,
      },
    };

    // Return the updated data object
    return {
      servings,
      mealType,
      data: {
        label,
        yield: originalYield,
        calories: calories * actualYield,
        ...actualNutrients,
      },
    };
  });

  return updatedData;
}

exports.getDietByEmail = async function (req, res) {
  res.send("test");
};

exports.createDiet = async function(userId, diet) {
  // Insert into Diet
  console.log(userId, diet);
  await Diet.create({
    userId: userId,
    assignedDishes: diet
  });
};

exports.getDiet = async function(req, res) {
  const dietRequest = {
    collection: "Diet",
    query: {
      userId: req.params.userId
    }
  }
  const result = await readOnly(dietRequest);
  
  if (result === undefined) {
    res.status(500).json({
      error: 500,
      msg: "Internal server error."
    });
  }
  else if (result.length === 0) {
    res.status(404).json({
      error: 404,
      msg: "Diet does not exist for user."
    });
  }
  else {
    res.status(200).json(result);
  }
}

exports.dietLog = asyncHandler(async (req, res, next) => {
  const { userId, targetDate } = req.body;

  const userDietLog = await DietLog.find({ userId: userId });

  if (!userDietLog) {
    return next(new ErrorResponse("User not found", 404));
  }

  const mealsMatchingTargetDate = userDietLog.filter((meal) => {
    const mealDate = convertObjectIdToDate(meal?._id);
    return mealDate === targetDate;
  });

  const mealData = mealsMatchingTargetDate.map((recipe) => {
    return {
      servings: recipe.servings,
      mealType: recipe.mealType,
      data: getNutritionInfo(recipe.data),
    };
  });

  res.status(200).json({
    success: true,
    data: calculateNutrients(mealData),
    originalData: mealData,
  });
});
