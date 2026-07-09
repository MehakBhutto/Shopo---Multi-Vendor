const express = require('express');
const upload = require('../multer');
const router = express.Router();
const { register } = require('../controller/userController')

router.post('/create-user', upload.single("file"), register)

module.exports = router;
