const express = require("express");
const router = express.Router();
const weatherappController = require("../controllers/unsplashController");

router.get("/photo", weatherappController.get_photo_for_location);

module.exports = router;
