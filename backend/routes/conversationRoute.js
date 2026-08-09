const express = require('express');
const router = express.Router();
const {
    createConversation,
    getAllConvers,
    updateLastMessage,
    getUserConvers,
} = require('../controller/conversationController');
const { isSeller, isAuthenticated } = require('../middleware/auth');

router.post('/create-new-conversation', createConversation);
router.get('/get-all-conversation-seller/:sellerId', isSeller, getAllConvers)
router.put('/update-last-message/:id', updateLastMessage);
router.get("/get-all-conversation-user/:id", isAuthenticated, getUserConvers);

module.exports = router;