const express = require("express");
const { read, create, del, emptyCollection } = require("../controllers/db");

const router = express.Router();

router.post("/read", read);
router.post("/create", create);
router.delete("/del", del);
router.delete("/emptyCollection", emptyCollection);

module.exports = router;