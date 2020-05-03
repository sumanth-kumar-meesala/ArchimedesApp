const express = require("express");
const router = express.Router();
const wine_controller = require("../controllers/wine.controller");

router.get("/getTopTen", wine_controller.getTopTen);

module.exports = router;
