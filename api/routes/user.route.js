const express = require("express");
const { test, updateUser, deleteUser, getUserListings, getUser } = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");
const { verify } = require("jsonwebtoken");

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser)

module.exports = router;
