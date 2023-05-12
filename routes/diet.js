const express = require("express");
const { getDietByEmail, dietLog, getDiet } = require("../controllers/diet");

const router = express.Router();

router.get("/getDietByEmail", getDietByEmail);
router.post("/dietLog", dietLog);
router.get("/:userId", getDiet);

module.exports = router;
