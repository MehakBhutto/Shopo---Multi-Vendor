const productModel = require('../models/productModel');
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require('../utils/ErrorHandler');
const shopModel = require("../models/shopModel");
const error = require("../middleware/error");
const fs = require("fs");


//create product
const createProduct = catchAsyncErrors(async (req, res, next) => {
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

        const productData = req.body;
        productData.images = imageUrl;
        productData.shop = shop;

        const product = await productModel.create(productData);

        res.status(201).json({
            success: true,
            product,
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
        return next(new ErrorHandler(e.message, 400))
    }
})

//get all products of a shop
const getAllProductsOfShop = catchAsyncErrors(async (req, res, next) => {
    try {

        const products = await productModel.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            products
        });

    } catch (e) {
        return next(new ErrorHandler(e.message, 400))
    }
});

//delete product of a shop
const DeleteShopProduct = catchAsyncErrors(async (req, res, next) => {
    try {

        const productId = req.params.id;

        const productData = await productModel.findById(productId);

        productData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uplods/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });

        const product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found with this id!", 500));
        }

        res.status(201).json({
            success: true,
            message: "Product Deleted Successfully!",
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
});

//get all products
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    try {

        const products = await productModel.find();

        if (!products) {
            return next(new ErrorHandler("No Products Found!", 400));
        }

        res.status(201).json({
            success: true,
            products
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 400));
    }

});

const createNewReview = catchAsyncErrors(async (req, res, next) => {
    try {

        const { user, rating, comment, productId } = req.body;

        const product = await productModel.findById(productId);

        console.log(product.reviews)

        const review = {
            user, rating, comment, productId,
        };


        const isReviewed = product.reviews.find(
            (rev) => rev.user._id === req.user._id
        );

        if (isReviewed) {
            product.reviews.forEach((res) => {
                if (rev.user._id === req.user._id) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        } else {
            product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating
        });

        product.ratings = avg / product.reviews.length;

        await productModel.findByIdAndUpdate(productId, product);

        res.status(200).json({
            success: true,
            message: "Reviewed successfully"
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 400));
    }
});

module.exports = {
    createProduct,
    getAllProductsOfShop,
    DeleteShopProduct,
    getAllProducts,
    createNewReview,
}
