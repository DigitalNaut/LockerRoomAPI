var express = require("express");
var router = express.Router();

const petitions = require("../controllers/petitions");
const authenticate = require("../controllers/middleware/authentication");

router.get("/", authenticate, petitions.get_all_petitions);
router.get("/:id", authenticate, petitions.get_petition);
router.post("/new", authenticate, petitions.new_petition);
router.put("/:id/edit", authenticate, petitions.edit_petition);
router.delete("/:id/remove", authenticate, petitions.delete_petition);

module.exports = router;
