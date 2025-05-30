const express = require("express");
const salebillrouter = express.Router();

const {addsalebill,editsalebill,deletesalebill,getsalebill,getAllsalebill} =require("../controller/salebillcontroller")

salebillrouter.get("/",getAllsalebill);
salebillrouter.post("/",addsalebill);
salebillrouter.get("/:sb_id",getsalebill);
salebillrouter.delete("/:sb_id",deletesalebill);
salebillrouter.put("/:sb_id",editsalebill);

module.exports=salebillrouter;