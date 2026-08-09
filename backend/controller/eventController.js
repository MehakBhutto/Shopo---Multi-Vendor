const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require('../utils/ErrorHandler');
const eventModel = require("../models/eventModel");
const shopModel = require("../models/shopModel");
const fs = require("fs");

//create event
const createEvent = catchAsyncErrors(async (req, res, next) => {
    try {

        const shopId = req.body.shopId;
        const shop = await shopModel.findById(shopId);
        if (!shop) {
            if (req.files) {
                req.files.forEach((file) => {
                    fs.unlink(`uploads/${file.filename}`, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }
            return next(new ErrorHandler("Shop Id is invalid", 400))
        }
        const files = req.files;
        const imageUrl = files.map((file) => `${file.filename}`);

        const eventData = req.body;
        eventData.images = imageUrl;
        eventData.shop = shop;

        const event = await eventModel.create(eventData);

        res.status(201).json({
            success: true,
            event,
        })

    } catch (e) {
        if (req.files) {
            req.files.forEach((file) => {
                fs.unlink(`uploads/${file.filename}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
        return next(new ErrorHandler(e.message, 400));
    }
})

//get all event of a shop
const getAllEventsOfShop = catchAsyncErrors(async (req, res, next) => {
    try {

        const events = await eventModel.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            events
        });

    } catch (e) {
        return next(new ErrorHandler(e.message, 400))
    }
});

//delete event of a shop
const DeleteShopEvent = catchAsyncErrors(async (req, res, next) => {
    try {

        const eventId = req.params.id;

        const eventData = await eventModel.findById(eventId);

        if (!eventData) {
            return next(new ErrorHandler("Event not found with this id!", 500));
        };

        eventData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });

        const event = await eventModel.findByIdAndDelete(eventId);

        if (!event) {
            return next(new ErrorHandler("Event not found with this id!", 500));
        }

        res.status(201).json({
            success: true,
            message: "Event Deleted Successfully!",
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 400))
    }
});

const getAllEvents = catchAsyncErrors(async(req, res, next) => {
    try{

        const events = await eventModel.find();
        if(!events){
            return next(new ErrorHandler("Event not found!", 500));
        }

        res.status(201).json({
            success: true,
            events
        })

    }catch(e){
        return next(new ErrorHandler(e.message, 400));
    }
})
module.exports = {
    createEvent,
    getAllEventsOfShop,
    DeleteShopEvent,
    getAllEvents,
}
