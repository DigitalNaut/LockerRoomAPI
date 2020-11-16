var express = require("express");
var router = express.Router();

const lockers = require("../controllers/lockers");
const authenticate = require("../controllers/middleware/authentication");
const admin = require("../controllers/middleware/admin");

router.post("/flush/:number", authenticate, admin, lockers.flush_lockers);
router.delete("/purge", authenticate, lockers.purge_lockers);

router.get("/list", authenticate, lockers.list_lockers);
router.get("/show/:id", authenticate, lockers.show_locker);

router.get("/", authenticate, lockers.show_user_lockers);
router.put("/claim/:id", authenticate, lockers.claim_locker);
router.delete("/release/:id", authenticate, lockers.release_locker);

module.exports = router;
