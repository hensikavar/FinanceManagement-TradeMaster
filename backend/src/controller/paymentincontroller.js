const mongoose = require("mongoose");
const paymentinmodel = require("../model/paymentin");
const partyModel =  require("../model/party")
const { json } = require("express");
const transactionmodel = require("../model/transaction");

const addpaymentin = async (req,res)=>{
    const {payin_id,payin_partyname,payin_phonenumber,payin_date,payin_paymenttype,payin_description,payin_received,payin_payment_ref_no}= req.body;

    if (payin_paymenttype === 'cheque' && !payin_payment_ref_no) {
        return res.status(400).send({ error: "Please enter payment reference number for cheque payment" });
    }
    const amtreceived = parseFloat(payin_received) || 0;
    const totalamt = amtreceived ;
    // console.log(amtpending);

    // const partyResponse = await fetch(`http://localhost:5000/party?pname=${payin_partyname}`);
    // const partyData = await partyResponse.json();
    // console.log(partyData)

    const party = await partyModel.findOne({ pname: payin_partyname });
    console.log(party._id)
    
    // Check if party exists
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }

    // Check if party exists
    // if (!partyData || partyData.length === 0) {
    //     return res.status(404).json({ error: "Party not found" });
    // }

    // Extract partyId from party data
    // const partyId = partyData[0]._id;
    const newpaymentin = new paymentinmodel({
        party_id:party._id,
        payin_id:payin_id,
        payin_partyname:payin_partyname,
        payin_phonenumber:payin_phonenumber,
        payin_date: new Date().toISOString().split("T")[0],
        payin_received:payin_received,
        payin_total_amt:totalamt,
        payin_paymenttype:payin_paymenttype,
        payin_payment_ref_no: payin_paymenttype === 'cheque' ? payin_payment_ref_no : null,// Include payment reference number if payment type is cheque
        payin_description:payin_description,
        // so_total_amt:so_toal_amt,
 
        
        //adminid:req.adminid,
    });

    try {
        await newpaymentin.save();
        console.log('payment in added successfully');
    
        const sglcredit = totalamt;
        // Create a new transaction record
        const newtransaction = new transactionmodel({
            party_id:party._id,
            tran_pname:party.pname,
            tran_type: 'payment in',
            tran_debit: 0,
            tran_credit: sglcredit,
            tran_date:Date.now(),
        });
        
        // Save the transaction record to the database
        await newtransaction.save();
        
        // Respond with the saved data
        console.log("data added successfully to transaction api");
        res.status(201).json({ newpaymentin, newtransaction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editpaymentin = async (req,res)=>{
    const {payin_id,payin_partyname,payin_phonenumber,payin_paymenttype,payin_description,payin_received,payin_payment_ref_no}= req.body;
    const amtreceived = parseFloat(payin_received) || 0;
    const totalamt = amtreceived ;

     try {
        const upadtepaymentin = await paymentinmodel.findOne({payin_id:req.params.payin_id})
        if (payin_paymenttype === 'cheque' && !payin_payment_ref_no) {
            throw new Error("Please enter payment reference number for cheque payment");
        }
        upadtepaymentin.payin_partyname = payin_partyname;
        upadtepaymentin.payin_phonenumber =payin_phonenumber;
        upadtepaymentin.sb_items = itemsWithSubtotal;
        upadtepaymentin.payin_received = payin_received;
        upadtepaymentin.payin_total_amt=totalamt;
        upadtepaymentin.payin_paymenttype = payin_paymenttype;
        if (payin_paymenttype === 'cheque') {
            upadtepaymentin.payin_payment_ref_no = payin_payment_ref_no;
        }
        upadtepaymentin.payin_description = payin_description;
        await upadtepaymentin.save();
        console.log("Edited successfully");
        res.status(201).json(upadtepaymentin);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "payin dosen't exists"})
        }
    };

const deletepaymentin = async (req,res)=>{
    try {
        const delpaymentin = await paymentinmodel.findOne({payin_id:req.params.payin_id})
        await delpaymentin.deleteOne();
        res.status(202).json(delpaymentin);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getpaymentin = async (req,res)=>{
    try{
        const onepaymentin = await paymentinmodel.findOne({payin_id:req.params.payin_id});
        res.status(200).json(onepaymentin);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllpaymentin = async (req,res)=>{
    allpaymentin = await paymentinmodel.find();
    res.send(allpaymentin);
};

module.exports ={addpaymentin,editpaymentin,deletepaymentin,getpaymentin,getAllpaymentin};
