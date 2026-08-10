const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    await mongoose.connect("mongodb://mhkfb15_db_user:mfbhutto2186@ac-iusu4t9-shard-00-00.erg46sh.mongodb.net:27017,ac-iusu4t9-shard-00-01.erg46sh.mongodb.net:27017,ac-iusu4t9-shard-00-02.erg46sh.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8cepq6-shard-0&authSource=admin&appName=Cluster0", {
        serverSelectionTimeoutMS: 10000,
    });
}

module.exports = connectDB;
