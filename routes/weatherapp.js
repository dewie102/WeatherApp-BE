const express = require("express");
const router = express.Router();
const weatherappController = require("../controllers/weatherappController");

router.get("/", (req, res) => {
    console.log("Routing on /api/weatherapp/");
    res.send("Routing on /api/weatherapp/");
});

router.post("/createuser", weatherappController.create_user);

router.post("/login", weatherappController.login_user);

module.exports = router;
