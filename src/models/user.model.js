import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();//if the password is not modified then go to next     
    this.password = await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
 return jwt.sign({
    _id : this._id,
 },process.env.TOKEN_SECRET
)}


export const  User = mongoose.model("User",userSchema)




