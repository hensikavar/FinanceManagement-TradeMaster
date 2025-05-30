const express = require("express");
const saleorderrouter = express.Router();

const {addsaleorder,editsaleorder,deletesaleorder,getsaleorder,getAllsaleorder} =require("../controller/saleordercontroller")

saleorderrouter.get("/",getAllsaleorder);
saleorderrouter.post("/",addsaleorder);
saleorderrouter.get("/:so_id",getsaleorder);
saleorderrouter.delete("/:so_id",deletesaleorder);
saleorderrouter.put("/:so_id",editsaleorder);

module.exports=saleorderrouter;