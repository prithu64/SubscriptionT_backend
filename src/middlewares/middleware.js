import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

const authMiddleware = async(req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')){
  throw new ApiError(400,"No Authorization Header found")
     }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
    if(decoded){
      req.userID = decoded._id;
      next();
    }else{
      throw new ApiError(400,"Token cannot be verified") 
    }
  } catch (error) {
     throw new ApiError(400,"User authorization failed")   
  } 
}

export {authMiddleware}