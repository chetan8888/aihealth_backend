const express = require("express");
const { register, login, logout, getProfile } = require("../controllers/auth");
const { initUserDietApi } = require("../controllers/initUserDiet");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile", getProfile);

router.get("/testUserDietInit", initUserDietApi);

module.exports = router;
