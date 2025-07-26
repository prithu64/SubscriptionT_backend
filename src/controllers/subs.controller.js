import { makeSubsSchema,updateSubsSchema } from "../validators/subs.validator.js";
import {ApiError} from "../utils/ApiError.js"
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { success } from "zod";

const makeSubscription =async(req,res)=>{
  
  const body = req.body;
  console.log("body: ",body)
  const {success} = makeSubsSchema.safeParse(body)
  if(!success){
    throw new ApiError(402,"Input validation failed")
  }

  //const subsID = req.userID;
  
  const createdSub = await Subscription.create({
    subsID : body.subsID,
    subs_name : body.subs_name,
    payment_plan: body.payment_plan,
    payment_amount : body.payment_amount,
    payment_date : new Date(body.payment_date)
  })
 
  if(!createdSub){
    throw new ApiError(500, "Error while creating subcription")
  }

  return res.json(new ApiResponse(200,{success : true},"Subscription created successfully"))

}

const updateSubscription = async(req,res) =>{
  const subcriptionID = req.params.id;
  const body = req.body;
  const {success} = updateSubsSchema.safeParse(body);

  if(!success){
    throw new ApiError(402,"Input Validation Error")
  }
 
  const updatedSub = await Subscription.findByIdAndUpdate({_id : subcriptionID},{
    ...body
  })

  if(updatedSub){
    return res.json(new ApiResponse(200,{success :true},"Subscription updated successfully"))
  }else{
     throw new ApiError(500,"Error while updating subcription")
  }

}

const getSubscription = async(req,res)=>{
  const  AllSubs = await Subscription.find();

  if(!AllSubs){
    throw new ApiError(500,"Subscription fetch error")
  }else{
    return res.json(new ApiResponse(200,{subs : AllSubs},"Subscription fetched successfully"))
  }
}

const deleteSubscription = async(req,res)=>{
  const subscriptionID = req.params.id
  try {
    await Subscription.findByIdAndDelete({_id : subscriptionID})
     return res.json(new ApiResponse(200,{success:true},"Subscription deleted Successfully"))
  } catch (error) {
    throw new ApiError(500,"Error while deleting")
  }
}


export {makeSubscription,updateSubscription,getSubscription,deleteSubscription}