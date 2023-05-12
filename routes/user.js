const express = require("express");
const { update, getAll } = require("../controllers/user");

const router = express.Router();

router.post("/update", update);

module.exports = router;