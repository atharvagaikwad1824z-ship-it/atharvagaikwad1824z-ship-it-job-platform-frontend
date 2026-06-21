const express = require('express');
const {registerUser , loginUser} = require('../controllers/userController');
const {protect,restrictTo} = require('../middleware/auth');
const upload = require('../middleware/logoUpload');
const {uploadLogo} = require('../controllers/userController');

const router = express.Router();

router.post('/upload-logo',protect,restrictTo('employer'),upload.single('logo'),uploadLogo);
router.post('/register',registerUser);
router.post('/login',loginUser);

module.exports = router;
