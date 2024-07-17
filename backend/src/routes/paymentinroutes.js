const express = require("express");
const paymentinrouter = express.Router();

const {addpaymentin,editpaymentin,deletepaymentin,getpaymentin,getAllpaymentin} =require("../controller/paymentincontroller")

paymentinrouter.get("/",getAllpaymentin);
paymentinrouter.post("/",addpaymentin);
paymentinrouter.get("/:payin_id",getpaymentin);
paymentinrouter.delete("/:payin_id",deletepaymentin);
paymentinrouter.put("/:payin_id",editpaymentin);

module.exports=paymentinrouter;