import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
   subsID : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
   },
   subs_name : {
    type : String,
    required : true
   },
   payment_date : {
    type : Date,
    required : true
   },
   payment_plan : {
    type : String,
    required : true
   },
   payment_amount : {
    type : Number,
    required : true
   }
})

 export const Subscription = mongoose.model("Subscription",subscriptionSchema);

