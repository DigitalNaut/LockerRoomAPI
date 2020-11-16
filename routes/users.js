var express = require("express");
var router = express.Router();

const user = require("../controllers/users");
const authenticate = require("../controllers/middleware/authentication");
const admin = require("../controllers/middleware/admin");

router.get("/all", authenticate, user.show_all_users);
router.post("/new", authenticate, admin, user.new_user);
router.get("/:username", authenticate, user.show_user);
router.put("/modify", admin, authenticate, user.modify_user);
router.delete("/remove", admin, authenticate, user.delete_user);

module.exports = router;
