const User=require("../models/User-model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const SECRET_KEY=process.env.SECRET_KEY;
exports.registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username ||!email ||!password){
        return res.status(400).json({msg:"some fields required"});
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({msg:"this user is already exist"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword
    });
    await newUser.save();
    return res.status(200).json({msg:"new user register",user:newUser.username});
})
exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({msg:"some fields required"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({msg:"cannot find this user"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({msg:"password incorrect"});
    };
    const payload={
        id:user._id,
        username:user.username,
        role:user.role
    };
    const token=jwt.sign(payload,SECRET_KEY,{expiresIn:"7d"});
    return res.status(200).json({msg:"you have loggin in successfully",token});
});


