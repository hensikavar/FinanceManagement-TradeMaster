const mongoose = require("mongoose");

const partySchema= mongoose.Schema({
    p_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    pname:{
        type:String,
        require : true
    },
    pcontact:{
        type:String,
        require : true
    },
    pemail:{
        type:String,
        require : true
    },
    pGSTIN:{
        type:String,
        require : true
    },
    pstate:{
        type:String,
        require:false
    },
    pshippingAddress:{
        type:String,
        require : true
    },
    pclosingBalance:{
        type:Number,
        require:false
    }
},
{
    timestamps:true,
    // _id: false,
    // toJSON: {
    //     transform: function (doc, ret) {
    //         ret.p_id = ret._id; // Rename _id to p_id
    //         delete ret._id; // Remove _id field
    //         delete ret.__v; // Optionally remove __v field
    //         return ret;
    //     }
    // }
});
module.exports = mongoose.model("Party",partySchema);
