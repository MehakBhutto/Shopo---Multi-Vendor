const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require('../utils/ErrorHandler');
const eventModel = require("../models/eventModel");
const shopModel = require("../models/shopModel");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } = require('../utils/cloudinaryUpload');

//create event
const createEvent = catchAsyncErrors(async (req, res, next) => {
    try {

        const shopId = req.body.shopId;
        const shop = await shopModel.findById(shopId);
        if (!shop) {
            if (req.files) {
                req.files.forEach((file) => {
                    const filePath = file.path;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }
            return next(new ErrorHandler("Shop Id is invalid", 400))
        }

        const files = req.files;
        const imageUrls = [];

        // Upload each file to Cloudinary
        for (const file of files) {
            try {
                const imageUrl = await uploadToCloudinary(file.path, 'shopo/events');
                imageUrls.push(imageUrl);
            } catch (error) {
                console.error('Error uploading file to Cloudinary:', error);
                // Clean up remaining files
                req.files.forEach((f) => {
                    const fPath = f.path;
                    fs.unlink(fPath, (err) => {
                        if (err) console.log(err);
                    });
                });
                return next(new ErrorHandler('Failed to upload images to Cloudinary', 400));
            }
        }

        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const event = await eventModel.create(eventData);

        res.status(201).json({
            success: true,
            event,
        })

    } catch (e) {
        if (req.files) {
            req.files.forEach((file) => {
                const filePath = file.path;
                fs.unlink(filePath, (err) => {
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

        // Delete images from Cloudinary
        for (const imageUrl of eventData.images) {
            try {
                const publicId = extractPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                // Continue with deletion even if Cloudinary deletion fails
            }
        }

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
