const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    sender_account_no:{
        type:String,
        required:true
    },
    receiver_account_no:{
        type:String,
        required:true
    },
 
    amount:{
        type:String,
        required:true
    },
   
    created_at:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Transaction', transactionSchema);