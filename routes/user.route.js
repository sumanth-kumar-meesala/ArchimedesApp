const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user.controller");
var VerifyToken = require("./VerifyToken");

router.get("/verify", user_controller.verify);
router.get("/resend", user_controller.resend);
router.post("/update-profile", VerifyToken, user_controller.update_profile);
router.post("/register", user_controller.register);
router.post("/payment", VerifyToken, user_controller.payment);
router.post("/login", user_controller.login);
router.post("/logout", VerifyToken, user_controller.logout);
router.post(
  "/malacards/bookmark",
  VerifyToken,
  user_controller.malacards_add_bookmark
);
router.post(
  "/malacards/remove-bookmark",
  VerifyToken,
  user_controller.malacards_remove_bookmark
);
router.post("/profile", VerifyToken, user_controller.profile);
router.post("/user/list-user", VerifyToken, user_controller.list_users);
router.post("/user/search", VerifyToken, user_controller.search);
router.post("/tga/bookmark", VerifyToken, user_controller.tga_add_bookmark);
router.post(
  "/tga/remove-bookmark",
  VerifyToken,
  user_controller.tga_remove_bookmark
);

module.exports = router;
