const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = catchAsyncErrors(async(req, res, next) => {
    try{

        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "pkr",
            metadata: {
                company: "Becoding"
            }
        });

        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret
        })

    }catch(e){
        res.status(500).json({success: false, message: e.message});
    }
});

const getStripeKey = catchAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        success: true,
        stripeApiKey: process.env.STRIPE_API_KEY });
});

module.exports = {
    processPayment,
    getStripeKey,
}