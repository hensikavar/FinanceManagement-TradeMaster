const mongoose = require("mongoose");

const salebillSchema= mongoose.Schema({
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Party' // Reference to the Party model
    },
    sb_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    sb_partyname:{
        type:String,
        require : true
    },
    sb_phonenumber:{
        type:String,
        require : true
    },
    sb_date:{
        type:String,
        require: true
    },
    sb_state:{
        type:String,
        require:true,
    },
    sb_items:
    [
        {
            sb_items_id:{
                type: mongoose.Schema.Types.ObjectId,
                require:true,
                ref:"Item"
            },
            sb_items_name:{
                type:String,
                require : true
            },
            sb_items_qty:{
                type:String,
                require : true
            },
            sb_items_unit:{
                type:String,
                require : false
            },
            sb_items_rate:{
                type:String,
                require : true
            },
            sb_items_subtotal:{
                type:Number,
                require : false
            },
            sb_items_disc:{
                type:String,
                require : false
            },
            sb_items_tax:{
                type:String,
                require : false
            },
            sb_items_totalamt:{
                type:Number,
                require : false
            }
        }
    ],
    sb_total_amt:{
        type:Number,
        require:false,
    },
    sb_received:{
        type:String,
        require : false
    },
    sb_balancedue:{
        type:Number,
        require : false
    },
    sb_paymenttype:{
        type:String,
        required: true,
        enum: ["cash", "cheque"]
    },
    sb_description:{
        type:String,
        require : true
    },
    sb_payment_ref_no: {
        type: String,
        required: function() {
            return this.sb_paymenttype === "cheque";
        }
    }
    // so_toal_amt:{
    //     type:Number,
    //     require:true,
    // }
    
},
{
    timestamps:true,
    
});
module.exports = mongoose.model("Salebill",salebillSchema);
