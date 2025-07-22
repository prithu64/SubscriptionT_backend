import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    unique : true,
    required : true,
    lowercase : true,
    trim : true
  },
  password : {
   type : String,
   required : [true,"Password is required"]   
  },
  email : {
   type : String,
   required : true,
   lowercase : true,
   trim : true
  }
},{timestamps : true})



export const  User = mongoose.model("User",userSchema)


