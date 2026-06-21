const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async(req,res)=> {
    try{
    const { name,email,password,role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({message:'User Already Exists!'})

    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({ name,email,password:hashedPassword,role});
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully'});
    }catch (error){
        res.status(500).json({message: 'Server Error'})
    }
};

exports.loginUser = async(req,res) =>{
    try{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user || !(await bcrypt.compare(password,user.password))){
        return res.status(400).json({ message: 'Invalid credentials'});
    }
    const token = jwt.sign({ id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'});
    
    res.json({
        message:"Login Successfull",
        token,
        user:{id:user._id,name:user.name,email:user.email,role:user.role,companyLogo:user.companyLogo||null}
    });
    } catch (error) {
        res.status(500).json({message:'Server Error'});
    }
};

exports.uploadLogo = async (req,res) =>{
    try{
        const user = await User.findById(req.user.id);
        if(!user || user.role !== 'employer'){
            return res.status(403).json({message:'Unauthorized'});
        }
        user.companyLogo = req.file.path;
        await user.save();
        res.status(200).json({message:'Logo Uploaded',logoUrl:req.file.path});
    }catch(error){
        res.status(500).json({message:'Server Error',error});
    }
};