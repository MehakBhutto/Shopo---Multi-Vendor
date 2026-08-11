const dotenv = require('dotenv');
const connectDB = require('./config/mongodb')


dotenv.config();
const app = require('./app')
const PORT = process.env.PORT;

//handling ncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
})

let server;

const startServer = async () => {
    await connectDB();

    server = app.listen(PORT, () => {
        console.log('Server is running on Port: ' + PORT)
    });
};

startServer().catch((err) => {
    console.log(`Failed to start server: ${err.message}`);
    process.exit(1);
});

//undefined promise rejecton
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the derver for ${err.message}`);

    if (!server) {
        process.exit(1);
    }

    server.close(() => {
        process.exit(1);
    })
})
