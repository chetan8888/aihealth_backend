const express = require("express");
const { goal, getUserCalories, getDates } = require("../controllers/goal");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/userGoal", goal);
router.post("/userCalories", getUserCalories);
router.post("/getDates", getDates);

module.exports = router;
