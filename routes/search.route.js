const express = require("express");
const router = express.Router();
const search_controller = require("../controllers/search.controller");
var VerifyToken = require("./VerifyToken");

router.post("/search", VerifyToken, search_controller.search);

module.exports = router;
