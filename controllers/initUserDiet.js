const { recommendRecipe } = require("./recommend");
const { topSearch } = require("./recipe");
const { createDiet } = require("./diet");

const SAMPLE_BREAKFAST_DISHES = [
    '63ccc00c3c1051750933c9ad8fb9e987',
    'ee6092cb5ff8b4d6c46482ca1e5d4ca7',
    '8aaf935a0992d5bf66c690cdf394f015',
    '80ffa6f067ed26dd624de1afcc838448',
    '51e55d07a1235eda0fc8f059a9eff5c4',
    'da57ba7e791f6848a9f0607ab2f4d2d6',
    '2a6125db43a0cfa7378d4c96b1a021f7'
];
const SAMPLE_LUNCH_DISHES = [
    '594efb858f0ddda5d60b8d9f8f9ebcb6',
    '513461d4bd4bc0c3d83c19c46ed58229',
    '1ae541b43e37b2bdc30719c62fe90051',
    '08cf244b096d4f46a72403a29fcc9c46',
    '0c40657155d21d64e76d43fccff5ba2e',
    '032c4d7996aee39f67370eab0c1f41b3',
    '38b53fb8f9f234af2e56c42c73d1b51d'
];
const SAMPLE_DINNER_DISHES = [
    'e3e22590e314df786f3d7489c6806073',
    '4aa222816242c5cde505c8b10672ce53',
    '2eeca46106805bd156bafa33e4bede66',
    '7d39b807788f861e337c84e0243c118e',
    'a56bff791826d63c6dcce920822c3bae',
    'bb2a953f870ce1cfc8273f1b7d1aec0e',
    '4a2a1bd0969b9d5cef8858d0dbe17082'
];

exports.initUserDietApi = (req, res, next) => {
    const userId = req.query.userId;
    this.initUserDiet(userId);
}

// Calls the recommendation API
const getRecommendation = async (userId) => {
    const result = await recommendRecipe(userId);
    return result;
};

// Search for each recipe based on name
const getDishIds = async (dishData) => {
    let dishIds = {
        breakfast: [],
        lunch: [],
        dinner: []
    };
    for (let i = 0; i < dishData.length; i++) {
        const data = dishData[i];
        const dish = await topSearch(data.name);
        if (dish) {
            const dishId = dish.uri.split("_")[1];
            dishIds[data.type].push(dishId);
        }
    }
    return dishIds;
};

// Insert into Diet
const createUserDiet = async (userId, diet) => {
    createDiet(userId, diet);
};

const checkEmptyDishes = (dishIds) => {
    if (dishIds.breakfast.length < 5) {
        dishIds.breakfast = SAMPLE_BREAKFAST_DISHES;
    }
    if (dishIds.lunch.length < 5) {
        dishIds.lunch = SAMPLE_LUNCH_DISHES;
    }
    if (dishIds.dinner.length < 5) {
        dishIds.dinner = SAMPLE_DINNER_DISHES;
    }
}

exports.initUserDiet = async (userId) => {
    const recommendation = await getRecommendation(userId);
    let dishData = []; // [ {name, type} ]
    recommendation.forEach((dish) => {
        const dishName = Object.keys(dish)[0];
        const typeMatrix = dish[dishName];
        let type = "dinner"; // Default?
        if (typeMatrix[0]) {
            type = "breakfast";
        }
        else if (typeMatrix[1]) {
            type = "lunch";
        }
        dishData.push({ name: dishName, type: type });
    });
    const dishIds = await getDishIds(dishData);

    checkEmptyDishes(dishIds);

    createUserDiet(userId, dishIds);
};

