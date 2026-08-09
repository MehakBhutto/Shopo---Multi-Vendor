const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require('../utils/ErrorHandler');
const CoupounCode = require("../models/coupounCode.js")
const mongoose = require("mongoose");

//create coupoun code
const createCoupoun = catchAsyncErrors(async(req, res, next) => {
    try{

        const isCoupounCodeExists = await CoupounCode.findOne({
            name: req.body.name
        });

        if(isCoupounCodeExists){
            return next(new ErrorHandler("Coupoun code already exists!", 400))
        }

        const coupounCode = await CoupounCode.create({
            ...req.body,
            shop: req.seller,
            shopId: req.seller._id.toString(),
        });

        res.status(201).json({
            success: true,
            coupounCode
        })

    }catch(e){
        return next(new ErrorHandler(e.message, 400))
    }
});

const getAllCoupoun = catchAsyncErrors(async(req, res, next) => {
    try{

        const shopObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
            ? new mongoose.Types.ObjectId(req.params.id)
            : req.params.id;

        const coupounCodes = await CoupounCode.find({
            $or: [
                { shopId: req.params.id },
                { "shop._id": shopObjectId },
                { "shop._id": req.params.id },
            ],
        });

        res.status(200).json({
            success: true,
            coupounCodes,
        })

    }catch(e){
        return next(new ErrorHandler(e.message, 400))
    }
});

const getCoupounCode = catchAsyncErrors(async(req, res, next) => {
    try{
console.log(req.params.name)
        const coupounCode = await CoupounCode.findOne({ name: req.params.name });

        if(!coupounCode){
            return next(new ErrorHandler("Coupoun code is incorrect!", 400))
        }

        res.status(200).json({
            success: true,
            coupounCode
        });

    }catch(e){
        return next(new ErrorHandler(e.message, 400))
    }
});

module.exports = {
    createCoupoun,
    getAllCoupoun,
    getCoupounCode,
}
