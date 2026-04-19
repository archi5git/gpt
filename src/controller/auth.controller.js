const userModel=require('../models/user.models');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

async function registerUser(req,res){
    const {fullname:{firstname,lastname},email,password}=req.body;
    const isUserExist=await userModel.findOne({email});
    if(isUserExist){
        return res.status(400).json({message:'User already exist'});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new userModel({
        email,
        fullname:{
            firstname,
            lastname
        },
        password:hashedPassword
    });
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
    res.cookie('token',token)
    res.status(201).json({message:'User registered successfully',user:{
        email:user.email,
        _id:user._id,
        fullname:user.fullname
    }
})
}
async function loginUser(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:'Invalid email or password'});
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid email or password'});
    }   
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
    res.cookie('token',token)
    res.status(200).json({message:'User logged in successfully',user:
    {
        email:user.email,
        _id:user._id,
        fullname:user.fullname
    }
})
}
module.exports={registerUser,loginUser};