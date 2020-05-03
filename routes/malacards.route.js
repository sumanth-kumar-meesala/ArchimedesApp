const express = require("express");
const router = express.Router();
const malacards_controller = require("../controllers/malacards.controller");
var VerifyToken = require("./VerifyToken");

router.post("/search", VerifyToken, malacards_controller.search);
router.get("/filters", VerifyToken, malacards_controller.filters);
router.post("/details", VerifyToken, malacards_controller.details);
module.exports = router;
