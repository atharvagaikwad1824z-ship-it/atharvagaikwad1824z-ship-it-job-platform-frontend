const express = require('express');
const {createJob , getJobs, getMyJobs, getJobById } = require('../controllers/jobController');
const {protect,restrictTo} = require('../middleware/auth');
const router = express.Router();


router.post('/',protect,restrictTo('employer'),createJob);
router.get('/', getJobs);
router.get('/my-jobs', protect, restrictTo('employer'), getMyJobs);
router.get("/:id", getJobById);


module.exports = router;
