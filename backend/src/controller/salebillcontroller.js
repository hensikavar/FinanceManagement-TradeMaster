const mongoose = require("mongoose");
const salebillmodel = require("../model/salebill");
const transactionmodel = require("../model/transaction")
const partyModel =  require("../model/party")
const itemmodel = require("../model/item")
const { json } = require("express");

const addsalebill = async (req,res)=>{
    const {sb_id,sb_partyname,sb_phonenumber,sb_items,sb_state,sb_paymenttype,sb_description,sb_received,sb_balancedue,sb_payment_ref_no}= req.body;

    if(!sb_partyname && !sb_items && !sb_state && !sb_paymenttype){
        return res.status(422).json({error: "Please enter required the fields"});
    }
    
    const mobileNumberPattern = /^[6-9]\d{9}$/;
    
    // Test the mobile number against the pattern
    if (!mobileNumberPattern.test(sb_phonenumber)) {
        return res.status(422).json({error: "Please enter valid phone number"}); // Valid mobile number
    }

    const itemsWithSubtotal = await Promise.all( sb_items.map(async item => {
        const itemfil = await itemmodel.findOne({ item_name: item.sb_items_name});
        if(!itemfil){
            return res.status(404).json({ error: "Item not found" });
        }
        const qty = parseFloat(item.sb_items_qty);
        const rate = parseFloat(item.sb_items_rate);
        const disc = parseFloat(item.sb_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.sb_items_tax) || 0; // Set default value to 0 if tax is NaN

        const sb_items_id = itemfil._id;
        const sb_items_subtotal = qty * rate;
        const sb_items_totalamt = sb_items_subtotal - (sb_items_subtotal * disc / 100) + (sb_items_subtotal * tax / 100);

        return {
            ...item,
            sb_items_id,
            sb_items_subtotal,
            sb_items_totalamt
        };
    }));
    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.sb_items_totalamt, 0);
    // console.log("totalAmt:", totalAmt); 

    const amtreceived = parseFloat(sb_received) || 0;
    const amtpending = totalAmt-amtreceived 
    // console.log(amtpending);

    const party = await partyModel.findOne({ pname: sb_partyname });
    // console.log(party._id)
    
    // Check if party exists
    if (!party) {
        return res.status(404).json({ message: "Party not found" });
    }

    const newsalebill = new salebillmodel({
        party_id:party._id,
        sb_id:sb_id,
        sb_partyname:sb_partyname,
        sb_phonenumber:sb_phonenumber,
        sb_date: new Date().toISOString().split("T")[0],
        sb_state : sb_state,
        sb_items:itemsWithSubtotal,
        sb_total_amt:totalAmt,
        sb_received:sb_received,
        sb_balancedue : amtpending,
        sb_paymenttype:sb_paymenttype,
        sb_description:sb_description,
        sb_payment_ref_no: sb_paymenttype === 'cheque' ? sb_payment_ref_no : null // Include payment reference number if payment type is cheque
        // so_total_amt:so_toal_amt,
    
        //adminid:req.adminid,
    });

    if (sb_paymenttype === 'cheque' && !sb_payment_ref_no) {
        return res.status(400).send({ error: "Please enter payment reference number for cheque payment" });
    }


    try {
        await newsalebill.save();
        console.log('Sale order added successfully');
    
        // Calculate total debit amount from the sale bill data
        const sgldebit = totalAmt
        //  const transactionPromises = [];
        // Create a new transaction record
        let newtransaction;

        for (const item of itemsWithSubtotal) {
            console.log("Creating transaction for item:", item);
            newtransaction = new transactionmodel({
                party_id: party._id,
                item_id:item.sb_items_id,
                tran_pname: party.pname,
                tran_type: 'sale',
                tran_debit: sgldebit, // Debit amount for each item
                tran_credit: 0,
                tran_date: new Date().toISOString().split('T')[0],
                tran_item_Qty: item.sb_items_qty,
                tran_item_Rate: item.sb_items_rate
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
        const sbpartytransactions = await salebillmodel.find({sb_party_id:req.params.id});
    
        res.status(201).json({ newsalebill, newtransaction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }    
    
}

const editsalebill = async (req,res)=>{
    const {sb_id,sb_partyname,sb_phonenumber,sb_items,sb_paymenttype,sb_description,sb_received,sb_balancedue}= req.body;

    // Check if payment type is cheque and payment reference number is missing
    if (sb_paymenttype === 'cheque' && !sb_payment_ref_no) {
        return res.status(400).send({ message: "Please enter payment reference number for cheque payment" });
    }
    
    const itemsWithSubtotal = sb_items.map(item => {
        const qty = parseFloat(item.sb_items_qty);
        const rate = parseFloat(item.sb_items_rate);
        const disc = parseFloat(item.sb_items_disc) || 0; // Set default value to 0 if disc is NaN
        const tax = parseFloat(item.sb_items_tax) || 0; // Set default value to 0 if tax is NaN

        const sb_items_subtotal = qty * rate;
        const sb_items_totalamt = sb_items_subtotal - (sb_items_subtotal * disc / 100) + (sb_items_subtotal * tax / 100);

        return {
            ...item,
            sb_items_subtotal,
            sb_items_totalamt
        };
    });
    const totalAmt = itemsWithSubtotal.reduce((total, item) => total + item.sb_items_totalamt, 0); 

    const amtreceived = parseFloat(sb_received) || 0;
    const amtpending = totalAmt-amtreceived ;

    const party = await partyModel.findOne({ pname: payin_partyname });
    console.log(party._id)
    
    // Check if party exists
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }

     try {
        const upadtesalebill = await salebillmodel.findOne({sb_id:req.params.sb_id})
        upadtesalebill.sb_partyname = sb_partyname;
        upadtesalebill.sb_phonenumber =sb_phonenumber;
        upadtesalebill.sb_items = itemsWithSubtotal;
        upadtesalebill.sb_total_amt=totalAmt;
        upadtesalebill.sb_received = sb_received;
        upadtesalebill.sb_balancedue = amtpending;
        upadtesalebill.sb_paymenttype = sb_paymenttype;
        upadtesalebill.sb_description = sb_description;
        if (sb_paymenttype === 'cheque') {
            upadtesalebill.sb_payment_ref_no = sb_payment_ref_no;
        }
        await upadtesalebill.save();
        console.log("Edited successfully");
        res.status(201).json(upadtesalebill);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "sale order dosen't exists"})
        }
    };

const deletesalebill = async (req,res)=>{
    try {
        const delsalebill = await salebillmodel.findOne({sb_id:req.params.sb_id})
        await delsalebill.deleteOne();
        res.status(202).json(delsalebill);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getsalebill = async (req,res)=>{
    try{
        const onesalebill = await salebillmodel.findOne({sb_id:req.params.sb_id});
        res.status(200).json(onesalebill);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllsalebill = async (req,res)=>{
    const allsalebill = await salebillmodel.find();
    res.send(allsalebill);
};

module.exports = {addsalebill,editsalebill,deletesalebill,getsalebill,getAllsalebill};
