var express = require("express");
var router = express.Router();

const events = require("../controllers/events");
const authenticate = require("../controllers/middleware/authentication");

router.post("/new", authenticate, events.new_event);
router.get("/user", authenticate, events.get_user_events);
router.get("/public", authenticate, events.get_public_events);
// router.get("/my", authenticate, events.get_events_by_user);
// router.get("/:title/:code", authenticate, events.get_event);
// router.put("/:title/:code/edit", authenticate, events.edit_event);
// router.delete("/:title/remove", authenticate, events.delete_event);

module.exports = router;
