require('dotenv').config();
const express = require('express')
const User = require('../models/User')
const router=express.Router()
const { body,validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const Secret_Code=process.env.Secret_Code
const fetchuser=require('../middleware/fetchUser')

// create user using: POST '/api/auth/CreateUser' doesn't require authorisation  : SignUp a User
router.post("/CreateUser", [
  body('name', 'Min 3 characters').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Enter a strong password').isStrongPassword()
], async (req, res) => {
  const errors = validationResult(req);
  let success = false;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  try {
    // 🔍 Check if email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success,
        message: "Email already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPass
    });

    const data = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(data, Secret_Code);
    success = true;

    return res.json({ success, token });

  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// Login user using: POST '/api/auth/Login' doesn't require authorisation  : Login a User
router.post("/Login",[
    body('email','Enter a Valid email').isEmail(),
    body('password','password Field cannot be blank').exists()
],async(req,res)=>{
    const errors=validationResult(req)
    let success=false
    if (!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()})
    }
    const {email,password}=req.body
    try {
        let user=await User.findOne({email})
        if (!user) {
            return res.status(400).json({success,error:"The Email or Password is Incorrect"})
        }
        const passcompare=await bcrypt.compare(password,user.password)
        if (!passcompare) {
            return res.status(400).json({success,error:"The Email or Password is Incorrect"})
        }
        // user Authorisation using json web token(jwt) when a user logins again
        const data={
            user:{
                id:user.id
            }
        }
        success=true
        const token=jwt.sign(data,Secret_Code)
        res.json({success,token})
    } catch (error) {
        console.error({error:error.message})
        res.status(500).send("Internal Error Occured")
    }
})

//route3: Authenticate/Get logged in user details using post:/api/auth/getUser : Login required 
router.post("/getUser",fetchuser,async(req,res)=>{
    try {
        userId=req.user.id
        const user = await User.findById(userId).select("-password")
        res.json(user)
    } catch (error) {
        console.error({error:error.message})
        res.status(500).send("Internal Error Occured")
    }
})

module.exports=router