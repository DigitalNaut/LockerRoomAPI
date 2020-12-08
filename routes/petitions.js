var express = require("express");
var router = express.Router();

const petitions = require("../controllers/petitions");
const authenticate = require("../controllers/middleware/authentication");
const admin = require("../controllers/middleware/admin");

// CREATE
router.post("/new", authenticate, petitions.new_petition);

// READ
router.get("/", authenticate, petitions.get_user_petitions);
router.get("/all", authenticate, admin, petitions.get_all_petitions);
router.get("/event/:event", authenticate, petitions.get_petitions_by_event);
router.get(
  "/event/:event/sender/:sender",
  authenticate,
  petitions.get_petition
);

// UPDATE
router.put("/event/:event", authenticate, petitions.edit_petition);
router.put("/resolve/:id", authenticate, petitions.resolve_petition);

// DELETE
router.delete("/delete/:id", authenticate, petitions.delete_petition);

module.exports = router;
