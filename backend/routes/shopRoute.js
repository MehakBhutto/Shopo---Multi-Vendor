const express = require("express");
const shopRouter = express.Router();
const upload = require("../multer");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const {
    createShop,
    activation,
    loginShop,
    getSeller,
    logoutSeller,
    updateShopAvatar,
    updateShopInfo,
    shopInfo,
} = require("../controller/shopController");

shopRouter.post("/create-shop", upload.single("file"), createShop)
shopRouter.post("/shop/activation", activation)
shopRouter.post("/login-shop", loginShop)
shopRouter.get("/getSeller",isSeller, getSeller)
shopRouter.get("/logout", isSeller, logoutSeller);
shopRouter.put("/update-shop-avatar", isSeller, upload.single("file"), updateShopAvatar);
shopRouter.put("/update-seller-info", isSeller, updateShopInfo);
shopRouter.get('/shop-info/:sellerId', shopInfo)

module.exports = shopRouter;