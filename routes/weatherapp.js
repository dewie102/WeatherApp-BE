const express = require("express");
const router = express.Router();
const weatherappController = require("../controllers/weatherappController");

router.get("/", (req, res) => {
    console.log("Routing on /api/weatherapp/");
    res.send("Routing on /api/weatherapp/");
});

router.post("/createuser", weatherappController.create_user);

router.post("/login", weatherappController.login_user);

router.get(
    "/getfavorites",
    weatherappController.is_valid_token,
    weatherappController.get_user_favorites
);

router.put(
    "/updatefavorites",
    weatherappController.is_valid_token,
    weatherappController.add_favorite_to_user
);

router.delete(
    "/deletefavorite",
    weatherappController.is_valid_token,
    weatherappController.delete_favorite_from_user
);

router.get("/photo", weatherappController.get_photo_for_location);

module.exports = router;
