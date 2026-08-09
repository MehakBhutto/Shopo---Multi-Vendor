const express = require("express");
const coupounRouter = express.Router();
const upload = require('../multer');
const { isSeller, isAuthenticated } = require('../middleware/auth')
const {
    createCoupoun,
    getAllCoupoun,
    getCoupounCode,
} = require("../controller/coupounCodeController");

coupounRouter.post('/create-coupoun-code', isSeller, createCoupoun);
coupounRouter.get('/get-coupoun/:id', isSeller, getAllCoupoun);
coupounRouter.get('/get-coupoun-value/:name', getCoupounCode)


module.exports = coupounRouter;
