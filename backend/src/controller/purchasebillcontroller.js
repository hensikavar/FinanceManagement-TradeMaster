const mongoose = require("mongoose");
const purchasebillmodel = require("../model/purchasebill");
const transactionmodel = require("../model/transaction")
const partyModel =  require("../model/party")
const itemmodel = require("../model/item")
const { json } = require("express");

const addpurchasebill = async (req,res)=>{
    const {pb_id,pb_partyname,pb_phonenumber,pb_items,pb_state,pb_paymenttype,pb_payment_ref_no,pb_description,pb_received,pb_balancedue}= req.body;
    if(!pb_partyname && !pb_items && !pb_state && !pb_paymenttype){
        return res.status(422).json({error: "Please enter all the fields"});
    }

    const itemsWithSubtotal = await Promise.all( pb_items.map(async item => {
        const itemfil = await itemmodel.findOne({ item_name: item.pb_items_name});
        if(!itemfil){
            return res.status(404).json({ error: "Item not found" });
        }
        const qty = parseFloat(item.pb_items_qty);
        const rate = parseFloat(item.pb_items_rate);
        const disc = parseFloat(item.pb_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.pb_items_tax) || 0; // Set default value to 0 if tax is NaN

        const pb_items_id = itemfil._id;
        const pb_items_subtotal = qty * rate;
        const pb_items_totalamt = pb_items_subtotal - (pb_items_subtotal * disc / 100) + (pb_items_subtotal * tax / 100);

        return {
            ...item,
            pb_items_id,
            pb_items_subtotal,
            pb_items_totalamt
        };
    }));
    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.pb_items_totalamt, 0);
    // console.log("totalAmt:", totalAmt); 

    const amtreceived = parseFloat(pb_received) || 0;
    const amtpending = totalAmt-amtreceived 
    // console.log(amtpending);

    const party = await partyModel.findOne({ pname: pb_partyname });
    // console.log(party._id)
    
    // Check if party exists
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }

    const newpurchasebill = new purchasebillmodel({
        party_id:party._id,
        pb_id:pb_id,
        pb_partyname:pb_partyname,
        pb_phonenumber:pb_phonenumber,
        pb_date: new Date().toISOString().split("T")[0],
        pb_state : pb_state,
        pb_items:itemsWithSubtotal,
        pb_total_amt:totalAmt,
        pb_received:pb_received,
        pb_balancedue : amtpending,
        pb_paymenttype:pb_paymenttype,
        pb_description:pb_description,
        pb_payment_ref_no: pb_paymenttype === 'cheque' ? pb_payment_ref_no : null // Include payment reference number if payment type is cheque
        // so_total_amt:so_toal_amt,
    
        //adminid:req.adminid,
    });

    if (pb_paymenttype === 'cheque' && !pb_payment_ref_no) {
        return res.status(400).send({ error: "Please enter payment reference number for cheque payment" });
    }


    try {
        await newpurchasebill.save();
        console.log('purchase order added successfully');
    
        // Calculate total debit amount from the sale bill data
        const sglcredit = totalAmt
        let newtransaction;

        for (const item of itemsWithSubtotal) {
            console.log("Creating transaction for item:", item);
            newtransaction = new transactionmodel({
                party_id: party._id,
                item_id:item.pb_items_id,
                tran_pname: party.pname,
                tran_type: 'purchase',
                tran_debit: 0, // Debit amount for each item
                tran_credit: sglcredit,//--------------------------------changes
                tran_date: new Date().toISOString().split('T')[0],
                tran_item_Qty: item.pb_items_qty,
                tran_item_Rate: item.pb_items_rate
            });
            // transactionPromises.push(newtransaction.save());
            // await Promise.all(transactionPromises);
            // Save the transaction record
            await newtransaction.save();
            console.log('Sale transaction  order added successfully');
        }

        // newtransaction.tran_date = new Date().toISOString().split('T')[0];
        
        // Save the transaction record to the database
        // await newtransaction.save();
    
        // Respond with the saved data
        const pbpartytransactions = await purchasebillmodel.find({pb_party_id:req.params.id});
    
        res.status(201).json({ newpurchasebill, newtransaction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }    
    
}

const editpurchasebill = async (req,res)=>{
    const {pb_id,pb_partyname,pb_phonenumber,pb_items,pb_paymenttype,pb_payment_ref_no,pb_description,pb_received,pb_balancedue}= req.body;

    // Check if payment type is cheque and payment reference number is missing
    if (pb_paymenttype === 'cheque' && !pb_payment_ref_no) {
        return res.status(400).send({ message: "Please enter payment reference number for cheque payment" });
    }
    
    const itemsWithSubtotal = pb_items.map(item => {
        const qty = parseFloat(item.pb_items_qty);
        const rate = parseFloat(item.pb_items_rate);
        const disc = parseFloat(item.pb_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.pb_items_tax) || 0; // Set default value to 0 if tax is NaN

        const pb_items_subtotal = qty * rate;
        const pb_items_totalamt = pb_items_subtotal - (pb_items_subtotal * disc / 100) + (pb_items_subtotal * tax / 100);

        return {
            ...item,
            pb_items_subtotal,
            pb_items_totalamt
        };
    });
    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.sb_items_totalamt, 0); 

    const amtreceived = parseFloat(pb_received) || 0;
    const amtpending = totalAmt-amtreceived ;

    const party = await partyModel.findOne({ pname: payout_partyname });
    console.log(party._id)
    
    // Check if party exists
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }

     try {
        const upadtepurchasebill = await purchasebillmodel.findOne({pb_id:req.params.pb_id})
        upadtepurchasebill.pb_partyname = pb_partyname;
        upadtepurchasebill.pb_phonenumber =pb_phonenumber;
        upadtepurchasebill.pb_items = itemsWithSubtotal;
        upadtepurchasebill.pb_total_amt=totalAmt;
        upadtepurchasebill.pb_received = pb_received;
        upadtepurchasebill.pb_balancedue = amtpending;
        upadtepurchasebill.pb_paymenttype = pb_paymenttype;
        upadtepurchasebill.pb_description = pb_description;
        if (pb_paymenttype === 'cheque') {
            upadtepurchasebill.pb_payment_ref_no = pb_payment_ref_no;
        }
        await upadtepurchasebill.save();
        console.log("Edited successfully");
        res.status(201).json(upadtepurchasebill);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "purchase order dosen't exists"})
        }
    };

const deletepurchasebill = async (req,res)=>{
    try {
        const delpurchasebill = await purchasebillmodel.findOne({pb_id:req.params.pb_id})
        await delpurchasebill.deleteOne();
        res.status(202).json(delpurchasebill);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getpurchasebill = async (req,res)=>{
    try{
        const onepurchasebill = await purchasebillmodel.findOne({pb_id:req.params.pb_id});
        res.status(200).json(onepurchasebill);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllpurchasebill = async (req,res)=>{
    const allpurchasebill = await purchasebillmodel.find();
    res.send(allpurchasebill);
};

module.exports = {addpurchasebill,editpurchasebill,deletepurchasebill,getpurchasebill,getAllpurchasebill};
