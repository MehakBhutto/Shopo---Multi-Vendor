const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const eventModel = require("../models/eventModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");

// create new order
const createOrder = catchAsyncErrors(async (req, res, next) => {
    try {

        const order = req.body;
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = order

        console.log(paymentInfo)
        //group cart item by shopId
        const shopItemsMap = new Map();

        for (const item of cart) {
            const shopId = item.shopId;
            if (!shopItemsMap.has(shopId)) {
                shopItemsMap.set(shopId, []);
            }
            shopItemsMap.get(shopId).push(item);
        }

        // create an order for each loop
        const orders = []

        for (const [shopId, items] of shopItemsMap) {
            const order = await orderModel.create({
                cart: items,
                shippingAddress,
                user,
                totalPrice,
                paymentInfo
            });
            orders.push(order);
        }

        res.status(201).json({
            success: true,
            orders
        })

    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});

const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user._id.toString() !== id) {
            return next(new ErrorHandler("You are not allowed to view these orders", 403));
        }

        const orders = await orderModel.find({ "user._id": id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});

const getAllSellerOrders = catchAsyncErrors(async (req, res, next) => {
    try {

        const orders = await orderModel.find({ "cart.shopId": req.params.shopId }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            orders
        })

    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});

const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    try {

        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        if (req.body.status === "Transferred to delivery partner") {
            await Promise.all(
                order.cart.map((o) => updateOrder(o._id, o.qty))
            );
        };

        order.status = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
            order.paymentInfo.status = "Succeeded";
        };

        await order.save({ validateBeforeSave: false })

        res.status(200).json({
            success: true,
            order
        });

        async function updateOrder(id, qty) {
            const product = await productModel.findByIdAndUpdate(
                id,
                {
                    $inc: {
                        stock: -qty,
                        sold_out: qty,
                    },
                },
                { new: true }
            );

            if (!product) {
                const event = await eventModel.findByIdAndUpdate(
                    id,
                    {
                        $inc: {
                            stock: -qty,
                            sold_out: qty,
                        },
                    },
                    { new: true }
                );
                if (!event) {
                    throw new ErrorHandler("Product not found with this id", 404);
                }
            }
        }

    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});

const orderRefund = catchAsyncErrors(async (req, res, next) => {
    try {

        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        order.status = req.body.status;

        await orderModel.findByIdAndUpdate(req.params.id, { status: order.status });

        res.status(200).json({
            success: true,
            order,
            message: "Order Refunded Request Successfully!"
        });

    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});

const orderRefundSuccess = catchAsyncErrors(async (req, res, next) => {
    try {

        const order = await orderModel.findByIdAndUpdate(req.params.id, { status: req.body.status });

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        if (req.body.status === "Refund Success") {
            await Promise.all(
                order.cart.map((item) => updateOrder(item._id, item.qty))
            );
        }

        return res.status(200).json({
            success: true,
            message: "Order Refunded Successfully",
            order
        });

        async function updateOrder(id, qty) {
            const product = await productModel.findByIdAndUpdate(
                id,
                {
                    $inc: {
                        stock: qty,
                        sold_out: -qty,
                    },
                },
                { new: true }
            );
        }


    } catch (e) {
        next(new ErrorHandler(e.message, 500));
    }
});


module.exports = {
    createOrder,
    getAllOrders,
    getAllSellerOrders,
    updateOrderStatus,
    orderRefund,
    orderRefundSuccess,
}
