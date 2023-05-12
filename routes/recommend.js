const express = require("express");
const { recommendRecipe } = require("../controllers/recommend");

const router = express.Router();

// const { protect } = require("../middleware/auth");

router.post("/recommendRecipe", recommendRecipe);


module.exports = router;
