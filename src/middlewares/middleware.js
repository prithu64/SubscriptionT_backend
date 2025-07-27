import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

const authMiddleware = async(req,res,next)=>{
    
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')){
  throw new ApiError(400,"No Authorization Header found")
     }
  
  console.log("authHeader: ",authHeader)
  const token = authHeader.split(' ')[1]
  console.log("token : ",token)

  try {
    console.log("decoding token")
    const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
    
    if(decoded){
      req.userID = decoded._id;
      next();
      console.log("go next")
    }else{
      throw new ApiError(400,"Token cannot be verified") 
    }

  } catch (error) {
     console.log("catch block error")
     throw new ApiError(400,"User authorization failed")   
  }
    
}

export {authMiddleware}