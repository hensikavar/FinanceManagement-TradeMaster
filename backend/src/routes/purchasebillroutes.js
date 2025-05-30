const express = require("express");
const purchasebillrouter = express.Router();

const {addpurchasebill,editpurchasebill,deletepurchasebill,getpurchasebill,getAllpurchasebill} =require("../controller/purchasebillcontroller")

purchasebillrouter.get("/",getAllpurchasebill);
purchasebillrouter.post("/",addpurchasebill);
purchasebillrouter.get("/:sb_id",getpurchasebill);
purchasebillrouter.delete("/:sb_id",deletepurchasebill);
purchasebillrouter.put("/:sb_id",editpurchasebill);

module.exports=purchasebillrouter;