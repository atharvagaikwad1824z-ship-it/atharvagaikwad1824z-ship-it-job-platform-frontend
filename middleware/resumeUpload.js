const multer = require('multer');
const { CloudinaryStorage } =require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'resumes',
        resource_type:'raw',
        use_filename:true,
        unique_filename:true,
    },
});

const upload = multer({ storage });
module.exports = upload;