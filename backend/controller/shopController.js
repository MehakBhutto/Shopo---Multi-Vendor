const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendShopToken = require('../utils/shopToken');
const { isAuthenticated } = require("../middleware/auth");
const shopModel = require("../models/shopModel");
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { serialize } = require('v8');

const createShop = async (req, res, next) => {
    try {

        const { email, name, password, address, phoneNumber, zipCode } = req.body;

        if (!req.file) {
            return next(new ErrorHandler("Avatar image is required", 400));
        }

        const sellerEmail = await shopModel.findOne({ email });

        if (sellerEmail) {
            const fileName = req.file.filename;
            const filePath = `uploads/${fileName}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const shopSeller = {
            name,
            email,
            password,
            avatar: fileUrl,
            address,
            phoneNumber,
            zipCode,
        };

        const activationToken = createActivationToken(shopSeller);

        const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

        const seller = await shopModel.create({
            ...shopSeller,
            accountVerified: true,
        });

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the Link to activate your account: ${activationUrl}`
            })

            res.status(201).json({
                success: true,
                message: `please check your email: ${seller.email} to activate your account!`,
            })
        } catch (e) {
            return next(new ErrorHandler(e.message, 500))
        }
    } catch (e) {
        return next(new ErrorHandler(e.message, 400));
    }
}

//create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "24h"
    })
}

//activate user
const activation = catchAsyncErrors(async (req, res, next) => {
    try {

        const { activation_token } = req.body;

        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400));
        }

        const { name, email, password, avatar, address, zipCode, phoneNumber } = newSeller;

        const existingUser = await shopModel.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const seller = await shopModel.create({
            name,
            email,
            avatar,
            password,
            address,
            zipCode,
            phoneNumber,
            accountVerified: true,
        });

        sendShopToken(seller, 201, res)

    } catch (e) {
        return next(e.message);
    }
});

//shop login
const loginShop = catchAsyncErrors(async(req, res, next) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new ErrorHandler("Please provide the all fields", 400));
        }

        const seller = await shopModel.findOne({ email }).select("+password");
        if(!seller){
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const isPasswordField = await seller.comparePassword(password);

        if(!isPasswordField){
            return next(new ErrorHandler("Please provide the correct Information!", 400));
        }

        sendShopToken(seller, 200, res);
    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
});

//load user
const getSeller = catchAsyncErrors(async(req, res, next) => {
    try{

        const seller = await shopModel.findById(req.seller.id).select("-password");

        if(!seller){
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        res.status(200).json({success: true, seller});

    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
});

// log out from shop
const logoutSeller = catchAsyncErrors(async(req, res, next) => {
    try{

        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(201).json({success: true, message: "Log out Successful!"})

    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
});

const updateShopInfo = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, description, address, phoneNumber, zipCode } = req.body;

        const shop = await shopModel.findById(req.seller._id).select("+password");

        if (!shop) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        // const isPasswordValid = await shop.comparePassword(password);

        // if (isPasswordValid === false) {
        //     return next(new ErrorHandler("Please provide the correct password!", 400));
        // }

        if (name) shop.name = name;
        if (description) shop.description = description;
        if (phoneNumber) shop.phoneNumber = phoneNumber;
        if (address) shop.address = address;
        if (zipCode) shop.zipCode = zipCode;

        await shopModel.findByIdAndUpdate(req.seller._id, shop, );

        res.status(201).json({ success: true, data:{shop, message: "Shop details are updated!"}});

    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

const updateShopAvatar = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler("Please upload an avatar image", 400));
        }

        const filename = req.file.filename;

        const existingUser = await shopModel.findById(req.seller._id);
        if (!existingUser) {
            await fs.unlink(path.join('uploads', filename)).catch(err => console.error(err));
            return next(new ErrorHandler("User does not exist!", 404));
        }

        const existAvatarPath = path.join('uploads', existingUser.avatar);
        if (fs.existsSync(existAvatarPath)) {
            fs.unlinkSync(existAvatarPath);
        }

        const updatedShop = await shopModel.findByIdAndUpdate(
            req.seller._id,
            { avatar: filename },
        );

        res.status(200).json({
            success: true,
            shop: updatedShop
        });
    } catch (e) {
        if (req.file) {
            fs.unlink(`uploads/${req.file.filename}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        return next(new ErrorHandler(e.message, 500));
    }
});

const shopInfo = catchAsyncErrors(async(req, res, next) => {
    try{

        const {sellerId} = req.params;

        const shop = await shopModel.findById(sellerId).select("-password");

        if(!shop) {
            return next(new ErrorHandler('Seller is not found!', 500));
        }

        res.status(201).json({
            success: true,
            shop
        })

    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
})


module.exports = {
    createShop,
    activation,
    loginShop,
    getSeller,
    logoutSeller,
    updateShopAvatar,
    updateShopInfo,
    shopInfo,
}