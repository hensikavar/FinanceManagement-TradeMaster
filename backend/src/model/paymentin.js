const mongoose = require("mongoose");

const paymentinSchema= mongoose.Schema({
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Party' // Reference to the Party model
    },
    payin_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    payin_partyname:{
        type:String,
        require : true
    },
    payin_phonenumber:{
        type:String,
        require : true
    },
    payin_date:{
        type:String,
        require: true
    },
    payin_total_amt:{
        type:Number,
        require:false,
    },
    payin_received:{
        type:String,
        require : false
    },
    payin_paymenttype:{
        type:String,
        require : true,
        enum:['cash','cheque'],
    },
    payin_description:{
        type:String,
        require : true
    },
    payin_payment_ref_no: {
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
module.exports = mongoose.model("Paymentin",paymentinSchema);
