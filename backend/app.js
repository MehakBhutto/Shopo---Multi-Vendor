const express = require('express');
const errorMiddleware = require('./middleware/error');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}))

//import routes

app.use('/api/v2/user', require('./routes/userRoute'));

//Its for ErrorHandling
app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('API Working')
})

module.exports = app
