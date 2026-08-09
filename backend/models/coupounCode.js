const mongoose = require("mongoose");

const coupounCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your coupoun code product name!"],
        unique: true,
    },
    value : {
        type: Number,
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    shop: {
        type: Object,
        required: true,
    },
    shopId: {
        type: String,
        required: true,
    },
    selectedProducts: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);
