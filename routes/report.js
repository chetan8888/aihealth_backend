const express = require("express");
const { dietLogByPeriod, checkin, dietLog, getCalories } = require("../controllers/report");

const router = express.Router();

router.post("/dietLogByPeriod", dietLogByPeriod);
router.post("/checkin", checkin);
router.post("/log", dietLog);
router.post("/getCalories", getCalories);

module.exports = router;
