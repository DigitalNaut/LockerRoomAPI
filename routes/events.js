var express = require("express");
var router = express.Router();

const events = require("../controllers/events");
const authenticate = require("../controllers/middleware/authentication");
const admin = require("../controllers/middleware/admin");

// CREATE
router.post("/new", authenticate, admin, events.new_event);

// READ
router.get("/all", authenticate, events.get_all_events);
router.get("/type/:type", authenticate, events.get_events_by_type);
router.get("/title/:title", authenticate, events.get_events_by_title);
router.get(
  "/type/:type/mandatory/:mandatory",
  authenticate,
  events.get_events_by_mandatory
);
router.get("/title/:title/code/:code", authenticate, events.get_event);
router.get("/by/:creator", authenticate, events.get_events_by_creator);

// POSSIBLE NEW ONES
// router.get(
//   "/current/type/:value",
//   authenticate,
//   events.get_current_events_by_type
// );
// router.get(
//   "/current/type/:type/mandatory/:value",
//   authenticate,
//   events.get_current_events_by_mandatory
// );

// UPDATE
router.put("/title/:title/code/:code", authenticate, events.edit_event);

// DELETE
router.delete("/title/:title/code/:code", authenticate, events.delete_event);

module.exports = router;
