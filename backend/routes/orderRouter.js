const express = require("express");
const router = express.Router();
const { isAuthenticated, isSeller } = require("../middleware/auth");
const {
    createOrder,
    getAllOrders,
    getAllSellerOrders,
    updateOrderStatus,
    orderRefund,
    orderRefundSuccess,
} = require('../controller/orderController');

router.post('/create-order', isAuthenticated, createOrder);
router.get('/get-all-orders/:id', isAuthenticated, getAllOrders);
router.get('/get-seller-all-orders/:shopId', getAllSellerOrders);
router.put('/update-order-status/:id', isSeller, updateOrderStatus);
router.put('/order-refund/:id', orderRefund);
router.put('/order-refund-success/:id', isSeller, orderRefundSuccess);


module.exports = router;
