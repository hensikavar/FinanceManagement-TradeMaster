const mongoose = require("mongoose");
const saleordermodel = require("../model/saleorder");
const { json } = require("express");

const addsaleorder = async (req,res)=>{
    const {so_id,so_partyname,so_phonenumber,so_duedate,so_items,so_total_amt}= req.body;

    const itemsWithSubtotal = so_items.map(item => {
        const qty = parseFloat(item.so_items_qty);
        const rate = parseFloat(item.so_items_rate);
        const disc = parseFloat(item.so_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.so_items_tax) || 0; // Set default value to 0 if tax is NaN

        const so_items_subtotal = qty * rate;
        const so_items_totalamt = so_items_subtotal - (so_items_subtotal * disc / 100) + (so_items_subtotal * tax / 100);

        return {
            ...item,
            so_items_subtotal,
            so_items_totalamt
        };
    });

    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.so_items_totalamt, 0);

    const newsaleorder = new saleordermodel({
        so_id:so_id,
        so_partyname:so_partyname,
        so_phonenumber:so_phonenumber,
        so_duedate:so_duedate,
        so_items:itemsWithSubtotal,
        so_total_amt:totalAmt,
    
        //adminid:req.adminid,
    });

    try{
        await newsaleorder.save();
        console.log('Sale order added successfully');
        res.status(201).json(newsaleorder);
        // .send({message:"data added successfully"});
    }
    catch (error){
        console.log(error);
        res.status(400).send({message : "data is not added"})
    }
}

const editsaleorder = async (req,res)=>{
    const {so_id,so_partyname,so_phonenumber,so_duedate,so_items,so_total_amt}= req.body;

    const itemsWithSubtotal = so_items.map(item => {
        const qty = parseFloat(item.so_items_qty);
        const rate = parseFloat(item.so_items_rate);
        const disc = parseFloat(item.so_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.so_items_tax) || 0; // Set default value to 0 if tax is NaN

        const so_items_subtotal = qty * rate;
        const so_items_totalamt = so_items_subtotal - (so_items_subtotal * disc / 100) + (so_items_subtotal * tax / 100);

        return {
            ...item,
            so_items_subtotal,
            so_items_totalamt
        };
    });

    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.so_items_totalamt, 0);

     try {
        const upadtesaleorder = await saleordermodel.findOne({so_id:req.params.so_id})
        upadtesaleorder.so_partyname = so_partyname;
        upadtesaleorder.so_phonenumber =so_phonenumber;
        upadtesaleorder.so_duedate = so_duedate;
        upadtesaleorder.so_items =itemsWithSubtotal ;
        upadtesaleorder.so_total_amt = totalAmt;

        await upadtesaleorder.save();
        console.log("Edited successfully");
        res.status(201).json(upadtesaleorder);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "sale order dosen't exists"})
        }
    };

const deletesaleorder = async (req,res)=>{
    try {
        const delsaleorder = await saleordermodel.findOne({so_id:req.params.so_id})
        await delsaleorder.deleteOne();
        res.status(202).json(delsaleorder);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getsaleorder = async (req,res)=>{
    try{
        const onesaleorder = await saleordermodel.findOne({so_id:req.params.so_id});
        res.status(200).json(onesaleorder);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllsaleorder = async (req,res)=>{
    allsaleorder = await saleordermodel.find();
    res.send(allsaleorder);
};

module.exports = {addsaleorder,editsaleorder,deletesaleorder,getsaleorder,getAllsaleorder};
