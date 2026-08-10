const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    await mongoose.connect("mongodb+srv://mhkfb15_db_user:mfbhutto2186@cluster0.erg46sh.mongodb.net/test?appName=Cluster0", {
        serverSelectionTimeoutMS: 10000,
    });
}

module.exports = connectDB;
