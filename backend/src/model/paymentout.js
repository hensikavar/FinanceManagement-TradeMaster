const mongoose = require("mongoose");

const paymentoutSchema= mongoose.Schema({
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Party' // Reference to the Party model
    },
    payout_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    payout_partyname:{
        type:String,
        require : true
    },
    payout_phonenumber:{
        type:String,
        require : true
    },
    payout_date:{
        type:String,
        require: true
    },
    payout_total_amt:{
        type:Number,
        require:false,
    },
    payout_received:{
        type:String,
        require : false
    },
    payout_paymenttype:{
        type:String,
        require : true,
        enum:['cash','cheque'],
    },
    payout_description:{
        type:String,
        require : true
    },
    payout_payment_ref_no: {
        type: String,
        required: function() {
            return this.payin_paymenttype === "cheque";
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

// paymentinSchema.pre('save', async function(next) {
//     if (!this.partyId) {
//         // Generate partyId if not provided
//         const PartyModel = mongoose.model('Party');
//         const party = await PartyModel.create({});
//         this.partyId = party._id;
//     }
//     next();
// });
module.exports = mongoose.model("Paymentout",paymentoutSchema);
