import mongoose from "mongoose";

const voucherSchma=new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    expire:{
        type:Date,
        required:true
    }
})
export const Voucher=mongoose.model("vouchers",voucherSchma)