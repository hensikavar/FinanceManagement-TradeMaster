//const bodyParser = require("body-parser");

//corse module to make Api run on any port
const cors = require("cors");

//moongose(connecting with mongodb atlas)
const mongoose = require("mongoose");

//importing router
const userrouter = require("./routes/userroutes")
const partyrouter = require("./routes/partyroutes")
const itemrouter = require("./routes/itemroutes")
const saleorderrouter = require("./routes/saleorderroutes")
const salebillrouter = require("./routes/salebillroutes")
const paymentinrouter = require("./routes/paymentinroutes");
const paymentoutrouter = require("./routes/paymentoutroute");
const transactionrouter = require("./routes/transactionroutes");
const purchasebillrouter = require("./routes/purchasebillroutes")

//creating express server
const express = require("express");
const app = express();
const PORT = 5000;

//using middleware
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); //data must be in json format before reaching to postman

//setting routes
app.use("/users",userrouter)
app.use("/party",partyrouter)
app.use("/item",itemrouter)
app.use('/saleorder',saleorderrouter)
app.use('/salebill',salebillrouter)
app.use('/purchasebill',purchasebillrouter)
app.use('/paymentin',paymentinrouter)
app.use("/paymentout",paymentoutrouter)
app.use('/transaction',transactionrouter)


//connexting with moongose
mongoose.connect("mongodb+srv://hensikavar:hensibtk@cluster0.zftqlsp.mongodb.net/TradeMaster?retryWrites=true&w=majority")//{useNewUrlParser:true}//
.then(()=>{
    console.log("Successfully Connected to Mongo Db");
    //starting server
    app.listen(PORT,(req,res)=>{
        console.log("Server is running on port "+PORT);
    })
    
})
.catch((error)=>{
    console.log("Not Connected");
    console.log(error);
})

