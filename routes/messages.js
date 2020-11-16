var express = require("express");
var router = express.Router();

const messages = require("../controllers/messages");
const authenticate = require("../controllers/middleware/authentication");

router.get("/all", authenticate, messages.get_user_messages);
router.post("/new", authenticate, messages.new_message);
router.get("/sent", authenticate, messages.get_sent_messages);
router.get("/received", authenticate, messages.get_received_messages);
router.get("/:id", authenticate, messages.get_message);
router.put("/:id/edit", authenticate, messages.edit_message);
router.delete("/:id/remove", authenticate, messages.delete_message);

module.exports = router;
