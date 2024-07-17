const mongoose = require("mongoose");

const transactionSchema=mongoose.Schema({
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party', // Assuming you have a Party model
        required: false
    },
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // Assuming you have a Party model
        required: false,
    },
    tran_pname:{
        type:String,
        ref:'Party',
        required:true
    },
    tran_type:{
        type:String,
        require:true,
        enum: ['sale', 'payment in',"purchase" ,"payment out"]
    },
    tran_credit:{
        type:Number,
        require:true
    },
    tran_debit:{
        type:Number,
        require:true
    },
    tran_date:{
        type:Date,
        require:true,
    },
    tran_item_Qty:{
        type:String,
        require:false,
    },
    tran_item_Rate:{
        type:String,
        require:false,
    },
    tran_status:{
        type:String,
        require:true,
        enum: ["paid", "unpaid"]
    }
    // tran_closing_bal:{
    //     type:Number,
    //     require:false
    // }
},{timestamps:true});

module.exports = mongoose.model("Transaction",transactionSchema);