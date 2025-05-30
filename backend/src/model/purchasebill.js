const mongoose = require("mongoose");

const purchasebillSchema= mongoose.Schema({
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Party' // Reference to the Party model
    },
    pb_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    pb_partyname:{
        type:String,
        require : true
    },
    pb_phonenumber:{
        type:String,
        require : true
    },
    pb_date:{
        type:String,
        require: true
    },
    pb_state:{
        type:String,
        require:true,
    },
    pb_items:
    [
        {
            pb_items_id:{
                type: mongoose.Schema.Types.ObjectId,
                require:true,
                ref:"Item"
            },
            pb_items_name:{
                type:String,
                require : true
            },
            pb_items_qty:{
                type:String,
                require : true
            },
            pb_items_unit:{
                type:String,
                require : false
            },
            pb_items_rate:{
                type:String,
                require : true
            },
            pb_items_subtotal:{
                type:Number,
                require : false
            },
            pb_items_disc:{
                type:String,
                require : false
            },
            pb_items_tax:{
                type:String,
                require : false
            },
            pb_items_totalamt:{
                type:Number,
                require : false
            }
        }
    ],
    pb_total_amt:{
        type:Number,
        require:false,
    },
    pb_received:{
        type:String,
        require : false
    },
    pb_balancedue:{
        type:Number,
        require : false
    },
    pb_paymenttype:{
        type:String,
        required: true,
        enum: ["cash", "cheque"]
    },
    pb_description:{
        type:String,
        require : true
    },
    pb_payment_ref_no: {
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
module.exports = mongoose.model("Purchasebill",purchasebillSchema);
