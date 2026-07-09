const ErrorHandler = require('../utils/ErrorHandler');
const userModel = require('../models/userModel')
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');

const register = async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler('Please provide name, email, and password', 400));
    }

    if (!req.file) {
        return next(new ErrorHandler('Please upload an avatar file', 400))
    }

    const userEmail = await userModel.findOne({ email });

    if (userEmail) {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });

        return next(new ErrorHandler("User already exists", 400))
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
        name,
        email,
        password,
        avatar: fileUrl
    }

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:4000/activation/${activationToken}`;

    try {
        await sendMail({
            email: user.email,
            subject: "Activate your account",
            message: `Hello ${user.name}, please click on the Link to activate your account: ${activationUrl}`
        })
    } catch (e) {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const message = e.code === "ETIMEDOUT" || e.message === "Connection timeout"
            ? "Email service connection timed out. Check SMTP port, firewall, or network access."
            : e.message;

        return next(new ErrorHandler(message, 503))
    }

    const newUser = await userModel.create(user);

    res.status(201).json({
        success: true,
        message: `please check your email: ${user.email} to activate your account!`,
        newUser,
    })
};

//create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "24h"
    })
}

//activate user 
module.exports = { register };
