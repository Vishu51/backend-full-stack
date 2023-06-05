const express = require("express");
const router = express.Router();

const usersController = require('../api/controllers/users')


// signup
router.post("/signup", usersController.user_signup);

//login api
router.post("/login", usersController.user_login);

// Delete user
router.delete("/:userId", usersController.delete_user);

module.exports = router;
