const express = require("express");
const itemrouter = express.Router();

const {additem,edititem,deleteitem,getitem,getAllitem} =require("../controller/itemcontroller")

itemrouter.get("/",getAllitem);
itemrouter.post("/",additem);
itemrouter.get("/:item_id",getitem);
itemrouter.delete("/:item_id",deleteitem);
itemrouter.put("/:item_id",edititem);

module.exports=itemrouter;