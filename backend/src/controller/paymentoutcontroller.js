const mongoose = require("mongoose");
const paymentoutmodel = require("../model/paymentout");
const partyModel =  require("../model/party")
const { json } = require("express");
const transactionmodel = require("../model/transaction");

const addpaymentout = async (req,res)=>{
    const {payout_id,payout_partyname,payout_phonenumber,payout_paymenttype,payout_description,payout_received,payout_payment_ref_no}= req.body;

    if (payout_paymenttype === 'cheque' && !payout_payment_ref_no) {
        return res.status(400).send({ error: "Please enter payment reference number for cheque payment" });
    }
    const amtreceived = parseFloat(payout_received) || 0;
    const totalamt = amtreceived ;
    // console.log(amtpending);

    // const partyResponse = await fetch(`http://localhost:5000/party?pname=${payin_partyname}`);
    // const partyData = await partyResponse.json();
    // console.log(partyData)

    const party = await partyModel.findOne({ pname: payout_partyname });
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
    const newpaymentout = new paymentoutmodel({
        party_id:party._id,
        payout_id:payout_id,
        payout_partyname:payout_partyname,
        payout_phonenumber:payout_phonenumber,
        payout_date: new Date().toISOString().split("T")[0],
        payout_received:payout_received,
        payout_total_amt:totalamt,
        payout_paymenttype:payout_paymenttype,
        payout_payment_ref_no: payout_paymenttype === 'cheque' ? payout_payment_ref_no : null,// Include payment reference number if payment type is cheque
        payout_description:payout_description,
        // so_total_amt:so_toal_amt,
 
        
        //adminid:req.adminid,
    });

    try {
        await newpaymentout.save();
        console.log('payment in added successfully');
    
        const sgldebit = totalamt;//---------------changes
        // Create a new transaction record
        const newtransaction = new transactionmodel({
            party_id:party._id,
            tran_pname:party.pname,
            tran_type: 'payment out',
            tran_debit: sgldebit,
            tran_credit: 0,
            tran_date:Date.now(),
        });
        
        // Save the transaction record to the database
        await newtransaction.save();
        
        // Respond with the saved data
        console.log("data added successfully to transaction api");
        res.status(201).json({ newpaymentout, newtransaction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editpaymentout = async (req,res)=>{
    const {payout_id,payout_partyname,payout_phonenumber,payout_paymenttype,payout_description,payout_received,payout_payment_ref_no}= req.body;

    const amtreceived = parseFloat(payout_received) || 0;
    const totalamt = amtreceived ;

     try {
        const upadtepaymentout = await paymentoutmodel.findOne({payout_id:req.params.payout_id})
        if (payout_paymenttype === 'cheque' && !payout_payment_ref_no) {
            throw new Error("Please enter payment reference number for cheque payment");
        }
        upadtepaymentout.payout_partyname = payout_partyname;
        upadtepaymentout.payout_phonenumber =payout_phonenumber;
        upadtepaymentout.sb_items = itemsWithSubtotal;
        upadtepaymentout.payout_received = payout_received;
        upadtepaymentout.payout_total_amt=totalamt;
        upadtepaymentout.payout_paymenttype = payout_paymenttype;
        if (payout_paymenttype === 'cheque') {
            upadtepaymentout.payout_payment_ref_no = payout_payment_ref_no;
        }
        upadtepaymentout.payout_description = payout_description;
        await upadtepaymentout.save();
        console.log("Edited successfully");
        res.status(201).json(upadtepaymentout);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "payout dosen't exists"})
        }
    };

const deletepaymentout = async (req,res)=>{
    try {
        const delpaymentout = await paymentoutmodel.findOne({payout_id:req.params.payout_id})
        await delpaymentout.deleteOne();
        res.status(202).json(delpaymentout);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getpaymentout = async (req,res)=>{
    try{
        const onepaymentout = await paymentoutmodel.findOne({payout_id:req.params.payout_id});
        res.status(200).json(onepaymentout);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllpaymentout = async (req,res)=>{
    const allpaymentout = await paymentoutmodel.find();
    res.send(allpaymentout);
};

module.exports ={addpaymentout,editpaymentout,deletepaymentout,getpaymentout,getAllpaymentout};
