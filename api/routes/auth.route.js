const express = require("express");
const { signup, signin, google, signout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", google);
router.get("/signout", signout);

module.exports = router;
