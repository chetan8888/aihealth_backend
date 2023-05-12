const express = require("express");
const { keywordSearch, recipe, topSearch } = require("../controllers/recipe");

const router = express.Router();

router.post("/keywordSearch", keywordSearch);
router.post("/recipe", recipe);
router.get("/search", topSearch);

module.exports = router;
