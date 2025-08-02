import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { signupValidationSchema,signinValidationSchema, updateValidationSchema,resetpassSchema} from "../validators/user.validation.js"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"

const transporter = nodemailer.createTransport({
  secure: true,
  service:'gmail', 
  port : 465,
  auth: {
    user:process.env.MAIL_ADD,
    pass:process.env.MAIL_PASS
  }
});

const makeToken = async(_id) =>{
    try {
       const user = await User.findById(_id)
       const accessToken = user.generateAccessToken()
       return accessToken
    } catch (error) {
       throw new ApiError(500,"Something went wrong while generation access token")
    }
} 

const signup = async(req,res) =>{
  //validation
  //create user object - db entry
  //check for user creation 
  //give response
  const {username,email,password} = req.body;//get body from req.body

  const {success} = signupValidationSchema.safeParse(req.body);

  if(!success){
    throw new ApiError(402,"input validation failed")
  }
 
  if(!username || !email || !password){
    throw new ApiError(400 ,"All fields are required")
  }

  const user = await User.findOne({    //check if user exist
    $or :[{username},{email}]
  })

  if(user){
    throw new ApiError(408,"Username/Email already exist")
  }

  const newUser = await User.create({  //creatng user
    username,  
    email,
    password
  }) 
  
  if(!newUser){
    throw new ApiError(500,"Error while signing up")
  }

  const createdUser = await User.findById({_id:newUser._id}).select(
    "-password"
  ) 

  if(createdUser){
    const accessToken = await makeToken(createdUser._id)
    return res.json(
    new ApiResponse(200,{user: createdUser,accessToken},"User created successfully")
  )}else{
    throw new ApiError(400,"Error while signing up")
  }
}

const signin = async(req,res)=>{
const {username,password} = req.body;
 
if(!username || !password){
  throw new ApiError(400,"All fields are required")
}

const {success} = signinValidationSchema.safeParse(req.body)
if(!success){
  throw new ApiError(400,"input validation failed")
}

const user = await User.findOne({username})

if(!user){
  throw new ApiError(400,"User does")
}

const passwordMatch = await user.isPasswordCorrect(password)

if(passwordMatch){
  const accessToken = user.generateAccessToken(user._id)
  return res.json(
    new ApiResponse(200,{accessToken},"Signed in successfully")
  )
}else{
  throw new ApiError(400,"wrong password")
}
}

const updateuser = async(req,res)=>{

  const body = req.body;
  const {success} = updateValidationSchema.safeParse(body);

  if(!success){
    throw new ApiError(400,"Input validation failed")
  }

  const updatedUser = await User.findOneAndUpdate({_id : req.userID},{
    username : body.username,
    email : body.email
  })

 if(!updatedUser){
  throw new ApiError(407,"user update failed")
 }else{
  return res.json(new ApiResponse(200,"user updated successfully"))
 }
}

const deleteuser = async(req,res)=>{
  try {
    await User.findByIdAndDelete({_id : req.userID})
    return res.json(new ApiResponse(200,"user deleted successfully"))
  } catch (error) {
    throw new ApiError(500,"failed to delete user")
  }
}

const getUser = async(req,res)=>{
  const user = await User.findOne({_id : req.userID}).select("-password")
  console.log(user)
  if(!user){
    throw new ApiError(400,"Error while fetching user")
  }

 return res.json(new ApiResponse(200,user,"User fetched successfully"))

}

const sendresetLink = async(req,res)=>{
  console.log("nodemailer add:",process.env.MAIL_ADD)
  console.log("nodemailer pass:",process.env.MAIL_PASS)
  console.log(typeof(process.env.MAIL_PASS))
    console.log(typeof(process.env.MAIL_ADD))
  console.log("recieved")
  const {email} = req.body;

  const user = await User.findOne({email});
  if(!user){
    throw new ApiError(400,"No such User")
  } 
  console.log("user found..")
  const token = jwt.sign({
    id : user._id
  },process.env.TOKEN_SECRET,
{expiresIn : '15m'})
  
 const resetLink =`http://localhost:5173/reset/${token}`
 
 console.log("transporter part ...")
 await transporter.sendMail({
    to : user.email,
    subject : 'Reset Password',
    html : `<a href="${resetLink}">Click to rest password</a>`
 })

return res.json(new ApiResponse(200,"reset link sent : check email "))
}

const changepass = async(req,res)=>{
  const {token} = req.params
  const body = req.body;
  const {success} = resetpassSchema.safeParse(body);
  if(!success){
    throw new ApiError(400,"Input validation failed")
  }
  const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
  if(!decoded){
    throw  new ApiError("400","Invalid token");
  }
  const password = await bcrypt.hash(body.password,10)
  try {
    await User.findByIdAndUpdate({_id : decoded.id},{
      password : password
    })
  return res.json(new ApiResponse(200,"Password Changed Successfully"))
  } catch (error) {
    throw new ApiError(407,"Error in changing password ")
  }
}

export {signup,signin,updateuser,deleteuser,getUser,sendresetLink,changepass}