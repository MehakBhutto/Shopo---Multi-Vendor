const dotenv = require('dotenv');
const connectDB = require('./config/mongodb')


dotenv.config();
connectDB()
const app = require('./app')
const PORT = process.env.PORT;

//handling ncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
})

const server = app.listen(PORT, () => {
    console.log('Server is running on Port: ' + PORT)
});

//undefined promise rejecton
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the derver for ${err.message}`);

    server.close(() => {
        process.exit(1);
    })
})
