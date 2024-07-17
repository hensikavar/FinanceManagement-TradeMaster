const express = require("express");
const partyrouter = express.Router();

const {addparty,editparty,deleteparty,getparty,getAllparty} =require("../controller/partycontroller")

partyrouter.get("/",getAllparty);
partyrouter.post("/",addparty);
partyrouter.get("/:p_id",getparty);
partyrouter.delete("/:p_id",deleteparty);
partyrouter.put("/:p_id",editparty);

module.exports=partyrouter;