//creating object of express Router
const express = require("express");
const transactionrouter = express.Router();

//importing variables of Controller
const {getallpartytransaction}=require("../controller/transactioncontroller")


//on posting data signup and signin controller will execute
// transactionrouter.post("/salebill",salebill);

// transactionrouter.post("/paymentin",payin);

// transactionrouter.get("/",getallpartytransaction)
transactionrouter.get("/:id",getallpartytransaction)
// transactionrouter.get("/:item_id",getallpartytransaction)

module.exports=transactionrouter;