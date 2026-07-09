const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    });
}

module.exports = connectDB;
