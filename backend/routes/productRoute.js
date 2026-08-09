const express = require("express");
const productRouter = express.Router();
const upload = require('../multer');
const { isSeller, isAuthenticated } = require('../middleware/auth')
const { 
    createProduct,
    getAllProductsOfShop,
    DeleteShopProduct,
    getAllProducts,
    createNewReview,
 } = require("../controller/productController");



productRouter.post("/create-product", upload.array("images"), createProduct);
productRouter.get('/get-all-products-shop/:id', getAllProductsOfShop);
productRouter.delete("/delete-shop-product/:id", isSeller, DeleteShopProduct);
productRouter.get("/get-product", getAllProducts);
productRouter.put('/create-new-review', isAuthenticated, createNewReview)


module.exports = productRouter;