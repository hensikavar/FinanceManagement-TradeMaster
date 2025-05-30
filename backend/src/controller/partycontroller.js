const mongoose = require("mongoose");
const partymodel = require("../model/party");
const transactionmodel = require("../model/transaction")
const { json } = require("express");

const addparty = async (req,res)=>{
    const {p_id,pname,pcontact,pemail,pGSTIN,pshippingAddress,pstate}= req.body;
    if(!pname || !pcontact){
        return res.status(422).json({error: "Please enter all the fields"});
    }

    try{
        const extistingparty = await partymodel.findOne({pname:pname});
        if(extistingparty){
            return res.status(400).json({
                error:"party already exists with this username"
            });
        }

        const newparty = new partymodel({
            p_id:p_id,
            pname:pname,
            pemail:pemail,
            pcontact:pcontact,
            pstate:pstate,
            pGSTIN:pGSTIN,
            pshippingAddress:pshippingAddress,
            // pclosingBalance:closingBalance,
            //adminid:req.adminid,
        });

        await newparty.save();

        const transactions = await transactionmodel.find({ party_id: newparty.p_id });
        const totalCredit = transactions.reduce((total, transaction) => total + transaction.tran_credit, 0);
        const totalDebit = transactions.reduce((total, transaction) => total + transaction.tran_debit, 0);
        const closingBalance = totalCredit - totalDebit;
        
        // Update the closing balance for the party
        newparty.pclosingBalance = closingBalance;
        await newparty.save();

        console.log('Party added successfully');
        res.status(201).json(newparty);
        // .send({message:"data added successfully"});
    }
    catch (error){
        console.log(error);
        res.status(400).send({message : "data is not added"})
    }
}

const editparty = async (req,res)=>{
    const {p_id,pname,pcontact,pemail,pGSTIN,pshippingAddress} = req.body;
     try {
        const upadteparty = await partymodel.findOne({p_id:req.params.p_id})
        upadteparty.pname = pname;
        upadteparty.pcontact =pcontact;
        upadteparty.pemail = pemail;
        upadteparty.pGSTIN = pGSTIN;
        upadteparty.pshippingAddress= pshippingAddress;
        await upadteparty.save();
        console.log("Edited successfully");
        res.status(201).json(upadteparty);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "party dosen't exists"})
        }
    };

const deleteparty = async (req,res)=>{
    try {
        const delparty = await partymodel.findOne({p_id:req.params.p_id})
        await delparty.deleteOne();
        res.status(202).json(delparty);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getparty = async (req,res)=>{
    try{
        const oneparty = await partymodel.findOne({p_id:req.params.p_id});
        res.status(200).json(oneparty);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllparty = async (req,res)=>{
    allparty = await partymodel.find();
    res.send(allparty);
};

module.exports = {addparty,editparty,deleteparty,getparty,getAllparty};