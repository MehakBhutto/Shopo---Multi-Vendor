const express = require('express');
const router = express.Router();
const upload = require('../multer');
const {
    createMessage,
    getAllMessage,
} = require('../controller/messagesController');

router.post('/create-new-message', upload.array('images'), createMessage);
router.get("/get-all-messages/:id", getAllMessage);

module.exports = router;