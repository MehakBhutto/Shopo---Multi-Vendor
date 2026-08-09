const express = require('express');
const upload = require('../multer');
const router = express.Router();
const { register, activation, login, getUser, logout, updateUserInfo, updateAvatar, updateUserAddresses, deleteUserAddress, changePassword } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/create-user', upload.single("file"), register);
router.post('/activation', activation);
router.post("/login-user", login);
router.get('/getuser', isAuthenticated, getUser)
router.get('/logout', isAuthenticated, logout)
router.put('/update-user-info', isAuthenticated, updateUserInfo);
router.put('/update-avatar', isAuthenticated, upload.single("file"), updateAvatar);
router.put('/update-user-addresses', isAuthenticated, updateUserAddresses);
router.delete('/delete-user-addresses/:id', isAuthenticated, deleteUserAddress);
router.put('/update-user-password', isAuthenticated, changePassword);

module.exports = router;
