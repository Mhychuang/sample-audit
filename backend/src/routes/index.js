/** Contain api routes of the application */

const { Router } = require("express");
const router = Router();

const {
    getPollingPlaces,
    getPollingPlaceById,
    createPollingPlace,
    updatePollingPlace,
    deletePollingPlace
} = require("../controllers/index.controller");

router.get("/pollingplaces", getPollingPlaces);
router.get("/pollingplaces/:id", getPollingPlaceById);
router.post("/pollingplaces", createPollingPlace);
router.put("/pollingplaces/:id", updatePollingPlace);
router.delete("/pollingplaces/:id", deletePollingPlace);

module.exports = router;
