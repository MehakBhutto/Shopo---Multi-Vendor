const express = require('express');
const errorMiddleware = require('./middleware/error');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://shopo-multi-vendor.vercel.app",
    credentials: true,
}));
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}))

//import routes

app.use('/api/v2/user', require('./routes/userRoute'));
app.use('/api/v2/shop', require('./routes/shopRoute'))
app.use('/api/v2/product', require('./routes/productRoute'))
app.use('/api/v2/event', require('./routes/eventRoute'));
app.use('/api/v2/coupoun', require('./routes/coupounCodeRoute'));
app.use('/api/v2/payment', require('./routes/paymentRoute'));
app.use('/api/v2/order', require('./routes/orderRouter'));
app.use('/api/v2/conversation', require('./routes/conversationRoute'));
app.use('/api/v2/message', require('./routes/messages'));


//Its for ErrorHandling
app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('API Working')
})

module.exports = app
