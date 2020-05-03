const express = require("express");
const router = express.Router();
const tga_controller = require("../controllers/tga.controller");
var VerifyToken = require("./VerifyToken");

router.post("/search", VerifyToken, tga_controller.search);
router.get("/filters", VerifyToken, tga_controller.filters);
router.post("/details", VerifyToken, tga_controller.details);
router.post("/add-tga", VerifyToken, tga_controller.add_tga);
module.exports = router;
