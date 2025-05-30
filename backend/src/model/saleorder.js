const mongoose = require("mongoose");

const saleorderSchema= mongoose.Schema({
    so_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    so_partyname:{
        type:String,
        require : true
    },
    so_phonenumber:{
        type:String,
        require : true
    },
    so_duedate:{
        type:String,
        require : true
    },
    so_items:
    [
        {
            so_items_name:{
                type:String,
                require : true
            },
            so_items_qty:{
                type:String,
                require : true
            },
            so_items_unit:{
                type:String,
                require : true
            },
            so_items_rate:{
                type:String,
                require : true
            },
            so_items_subtotal:{
                type:Number,
                required: false 
            },
            so_items_disc:{
                type:String,
                required: false 
            },
            so_items_tax:{
                type:String,
                required: false 
            },
            so_items_totalamt:{
                type:Number,
                required: false 
            }
        }
    ],
    so_total_amt:{
        type:Number,
        required: false 
    }
    
},
{
    timestamps:true,
    
});
module.exports = mongoose.model("Saleorder",saleorderSchema);
