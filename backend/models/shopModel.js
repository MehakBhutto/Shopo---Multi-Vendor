const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your shop name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your shop email address"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password must have at least 8 characters."],
        maxlength: [32, "Password cannot have more than 32 characters."],
        select: false
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber : {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "seller"
    },
    zipCode: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    accountVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

// hash password
shopSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// jwt token
shopSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
