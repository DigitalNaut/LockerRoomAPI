const express = require("express");
const router = express.Router();

const cors = require("cors");
const auth = require("../controllers/auth");
const authenticate = require("../controllers/middleware/authentication");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", authenticate, auth.logout);
router.delete("/remove", authenticate, auth.remove);

module.exports = router;
