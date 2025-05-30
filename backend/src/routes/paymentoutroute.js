const express = require("express");
const paymentoutrouter = express.Router();

const {addpaymentout,editpaymentout,deletepaymentout,getpaymentout,getAllpaymentout} =require("../controller/paymentoutcontroller")

paymentoutrouter.get("/",getAllpaymentout);
paymentoutrouter.post("/",addpaymentout);
paymentoutrouter.get("/:payout_id",getpaymentout);
paymentoutrouter.delete("/:payout_id",deletepaymentout);
paymentoutrouter.put("/:payout_id",editpaymentout);

module.exports=paymentoutrouter;