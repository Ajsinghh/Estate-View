const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const { request } = require("express");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created succesfully");
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const {password: pass, ...rest} = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 10), //expire after 10 days
      })
      .status(200)
      .json(rest); 
  } catch (error) {    
    next(error);
  }
};

const google = async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if(user){
    const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
    const {password: pass, ...rest} = user._doc;
    res
    .cookie("access_token", token,{
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 10), 
    })
    .status(200)
    .json(rest);
  }else{
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatePassword,10);
    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,  
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 10),
      })
      .status(200)
      .json(rest);
  }
}

const signout = (req, res, next)=>{
   try{
     res.clearCookie('access_token');
     res.status(200).json('User has been logged out')
   } catch(error){
     next(error);
   }
}

module.exports = {signup,signin,google,signout};
