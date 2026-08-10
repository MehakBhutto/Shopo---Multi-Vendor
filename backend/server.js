const dotenv = require('dotenv');
const connectDB = require('./config/mongodb')


dotenv.config();
connectDB()
const mongoose = require('mongoose');
console.log('MONGO_URI present?', !!process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('connected'); process.exit(0); })
  .catch(err => { console.error('connect error', err); process.exit(1); });
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
