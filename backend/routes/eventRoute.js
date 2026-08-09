const express = require("express");
const eventRouter = express.Router();
const upload = require('../multer');
const { isSeller } = require('../middleware/auth')
const { 
    createEvent,
    getAllEventsOfShop,
    DeleteShopEvent,
    getAllEvents,
 } = require("../controller/eventController");



eventRouter.post("/create-event", upload.array("images"), createEvent);
eventRouter.get("/get-all-events", getAllEvents);
eventRouter.get('/get-all-events/:id', getAllEventsOfShop);
eventRouter.delete("/delete-shop-event/:id", isSeller, DeleteShopEvent);

module.exports = eventRouter;