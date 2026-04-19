const express=require('express');
const authModel=require('../controller/auth.controller');

const router=express.Router();
router.post('/register',authModel.registerUser);
router.post('/login',authModel.loginUser);

module.exports=router;