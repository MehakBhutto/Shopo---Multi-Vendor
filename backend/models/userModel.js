const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
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
    address: {
        type: [
            {
                country: { type: String },
                city: { type: String },
                address1: { type: String },
                address2: { type: String },
                zipCode: { type: String },
                addressType: { type: String },
            }
        ],
        default: [],
    },
    phoneNumber: {
        type: String,
        minlength: [11, "Phone number must have at least 11s digits."],
        // required: [true, "Please enter your phone number"],
    },
    role: {
        type: String,
        default: "user"
    },
    accountVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
        required: true,
    },
})

// hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


const User = mongoose.model("User", userSchema);
module.exports = User;
