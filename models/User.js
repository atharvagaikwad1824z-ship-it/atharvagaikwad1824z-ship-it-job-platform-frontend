const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role:{type:String,enum:['candidate','employer','admin'],default:'candidate',required:true},
    companyLogo:{type:String}
});
module.exports = mongoose.model('User',UserSchema);