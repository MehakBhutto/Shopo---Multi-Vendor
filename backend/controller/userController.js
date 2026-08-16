const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const userModel = require('../models/userModel')
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendToken = require('../utils/jwtToken');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } = require('../utils/cloudinaryUpload');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler('Please provide name, email, and password', 400));
        }

        if (!req.file) {
            return next(new ErrorHandler('Please upload an avatar file', 400))
        }

        const userEmail = await userModel.findOne({ email });

        if (userEmail) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            return next(new ErrorHandler("User already exists", 400))
        }

        // Upload avatar to Cloudinary
        let avatarUrl;
        try {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            avatarUrl = await uploadToCloudinary(filePath, 'shopo/users');
        } catch (error) {
            console.error('Error uploading avatar to Cloudinary:', error);
            return next(new ErrorHandler('Failed to upload avatar to Cloudinary', 400));
        }

        const user = {
            name,
            email,
            password,
            avatar: avatarUrl,
            accountVerified: false,
        }

        const activationToken = createActivationToken(user);

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const activationUrl = `${clientUrl}/activation/${activationToken}`;


        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.name}, please click on the Link to activate your account: ${activationUrl}`
            })
        } catch (e) {
            return next(new ErrorHandler(e.message, 400))
        }

        res.status(201).json({
            success: true,
            message: `please check your email: ${user.email} to activate your account!`,
        })
    } catch (e) {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        return next(new ErrorHandler(e.message, 400))
    }
};

//create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "24h"
    })
}

//activate user
const activation = catchAsyncErrors(async (req, res, next) => {
    try {

        const { activation_token } = req.body;

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }

        const { name, email, password, avatar } = newUser;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const user = await userModel.create({
            name,
            email,
            avatar,
            password,
            accountVerified: true,
        });

        sendToken(user, 201, res)

    } catch (e) {
        return next(e.message);
    }
});

const login = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide the all fields", 400));
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const isPasswordField = await user.comparePassword(password);

        if (!isPasswordField) {
            return next(new ErrorHandler("Please provide the correct Information!", 400));
        }

        sendToken(user, 200, res);
    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//load user
const getUser = catchAsyncErrors(async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user._id).select("-password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        res.status(200).json({ success: true, user });

    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

// log out user
const logout = catchAsyncErrors(async (req, res, next) => {
    try {

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(201).json({ success: true, message: "Log out Successful!" })

    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

const updateUserInfo = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        const user = await userModel.findById(req.user._id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const isPasswordValid = await user.comparePassword(password);
        console.log(isPasswordValid)
        if (isPasswordValid === false) {
            return next(new ErrorHandler("Please provide the correct password!", 400));
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, user);

        res.status(200).json({ success: true, user: updatedUser });

    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

const updateAvatar = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler("Please upload an avatar image", 400));
        }

        const existingUser = await userModel.findById(req.user._id);
        if (!existingUser) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            await fs.unlink(filePath, (err) => console.error(err));
            return next(new ErrorHandler("User does not exist!", 404));
        }

        // Upload new avatar to Cloudinary
        let newAvatarUrl;
        try {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            newAvatarUrl = await uploadToCloudinary(filePath, 'shopo/users');
        } catch (error) {
            console.error('Error uploading new avatar to Cloudinary:', error);
            return next(new ErrorHandler('Failed to upload avatar to Cloudinary', 400));
        }

        // Delete old avatar from Cloudinary after the replacement upload succeeds.
        if (existingUser.avatar) {
            try {
                const publicId = extractPublicIdFromUrl(existingUser.avatar);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                console.error('Error deleting old avatar from Cloudinary:', error);
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { avatar: newAvatarUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (e) {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        return next(new ErrorHandler(e.message, 500));
    }
});

const updateUserAddresses = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const sameTypeAddress = user.address.find((address) => address.addressType === req.body.addressType);
        if (sameTypeAddress) {
            return next(new ErrorHandler(`Address of type ${req.body.addressType} already exists`, 400));
        }

        const existAddress = user.address.find((address) => address._id === req.body._id);
        if (existAddress) {
            Object.assign(existAddress, req.body);
        }
        else {
            user.address.push(req.body);
        }

        const newUser = await userModel.findByIdAndUpdate(req.user._id, user, { new: true });

        res.status(200).json({ success: true, user: newUser });

    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

const deleteUserAddress = catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await userModel.updateOne(
        {
          _id: userId,
        },
        { $pull: { address: { _id: addressId } } }
      );

      const user = await userModel.findById(userId);

      res.status(200).json({ success: true, user });


    } catch (e) {
        return next(new ErrorHandler(e.message, 500));
    }
});

const changePassword = catchAsyncErrors(async (req, res, next) => {
    try{

        const user = await userModel.findById(req.user._id).select("+password");
        
        if(!user){
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const isPasswordValid = await user.comparePassword(req.body.oldPassword);
        if(!isPasswordValid){
            return next(new ErrorHandler("Please provide the correct password!", 400));
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHandler("Password doesn't match!", 400));
        }
        
        user.password = req.body.newPassword;

        const newUser = await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully!" });

    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
});

const userInfo = catchAsyncErrors(async (req, res, next) => {
    try{

        const { userId } = req.params;

        const user = await userModel.findById(userId)

        res.status(200).json({
            success: true,
            user
        })

    }catch(e){
        return next(new ErrorHandler(e.message, 500));
    }
});

module.exports = { 
    register, 
    activation, 
    login, 
    getUser, 
    logout, 
    updateUserInfo, 
    updateAvatar, 
    updateUserAddresses, 
    deleteUserAddress, 
    changePassword, 
    userInfo };
