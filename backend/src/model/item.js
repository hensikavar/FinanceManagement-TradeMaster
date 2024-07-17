const mongoose = require("mongoose");

const itemSchema= mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    item_name:{
        type:String,
        require : true
    },
    item_category:{
        type:String,
        require : true
    },
    item_code:{
        type:String,
    },
    item_HSN_SAC_CODE:{
        type:String,
    },
    item_saleprice:{
        type:String,
        require : true
    },
    item_saleprice_disc:{
        type:String,
    },
    item_purchaseprice:{
        type:String,
        require : true
    },
    item_purchaseprice_disc:{
        type:String,
    },
    item_taxes:{
        type:String,
    },
    item_stockqty:{
        type:String,
    }
},
{
    timestamps:true,
});
module.exports = mongoose.model("Item",itemSchema);
