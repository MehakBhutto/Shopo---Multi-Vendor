const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server Error"

    //wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resources not found ith this id.. Invalid ${err.path}`;
        err =  new ErrorHandler(message, 400);
    }

    //Duplicate key error
    if(err.code === 11000){
        const message  = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    } 

    //mongoose validation error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((value) => value.message).join(", ");
        err = new ErrorHandler(message, 400);
    }
    
    //wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Your url is invalid plase try again later`;
        err = new ErrorHandler(message,400);
    }

    //jwt expired
    if(err.name === "TokenExpiredError"){
        const message = `Your url is expird please try again later!`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
