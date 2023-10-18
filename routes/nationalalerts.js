const express = require("express");
const router = express.Router();
const nationalAlertsController = require("../controllers/nationalAlertsController");

router.get("/", nationalAlertsController.nationalAlerts_top_active_alerts);

module.exports = router;
