import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { signupValidationSchema } from "../validators/user.validation.js"

const makeToken = async(_id) =>{
    try {
       const user = await User.findById(_id)
       const accessToken = user.generateAccessToken()
       return {accessToken}
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
    const token = await makeToken(createdUser._id)
    console.log("token :",token)
    return res.json(
    new ApiResponse(200,{user: createdUser,token},"User created successfully")
  )}else{
    throw new ApiError(400,"Error while signing up")
  }
}


export {signup}