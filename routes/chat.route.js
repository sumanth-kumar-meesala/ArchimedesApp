const express = require("express");
const router = express.Router();
const chat_controller = require("../controllers/chat.controller");
var VerifyToken = require("./VerifyToken");

router.post("/get-chat", VerifyToken, chat_controller.get_chat);
router.post("/add-user", VerifyToken, chat_controller.add_user);
router.post("/add-chat", VerifyToken, chat_controller.add_chat);

module.exports = router;
