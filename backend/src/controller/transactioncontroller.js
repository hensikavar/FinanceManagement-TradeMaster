const mongoose = require("mongoose");
const transactionmodel = require("../model/transaction");
// const salebillmodel = require("../model/salebill");
// const paymentin =  require("../model/paymentin");

// const salebill = async(req,res)=>{
//     try {
//         // Calculate total debit amount from the sale bill data
//         const sgldebit = req.body.sb_items.reduce((total, item) => total + item.sb_items_totalamt, 0);
        
//         // Create a new transaction record
//         const newtransaction = new transactionmodel({
//           type: 'sale',
//           debit: sgldebit,
//           credit: 0, // There's no credit for sale
//         });
        
//         // Save the transaction record to the database
//         await newtransaction.save();
        
//         // Respond with the saved transaction data
//         res.status(201).json(transaction);
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

// const payin = async (req,res)=>{
//     try {
//         // const {payin_id,payin_partyname,payin_phonenumber,payin_paymenttype,payin_description,payin_received,payin_payment_ref_no}= req.body;

//         // Calculate total credit amount from the payment in data
//         const sglcredit = req.body.payin_total_amt;
//         console.log(sglcredit)
//         // Create a new transaction record
//         const newtransaction = new transactionmodel({
//           type: 'payment in',
//           debit: 0, // There's no debit for payment in
//           credit: sglcredit,
//         });
        
//         // Save the transaction record to the database
//         await newtransaction.save();
        
//         // Respond with the saved transaction data
//         console.log("data added successfully to transaction api")
//         res.status(201).json(transaction);
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }  
// }
// const getallitemtransaction = async (req, res) => {
//   try {
//     // Retrieve all transaction records from the database
//     const transactions = await transactionmodel.find({item_id:req.params.item_id});
//     // Respond with the transaction data
//     res.json(transactions);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const getallpartytransaction = async (req, res) => {
    try {
      // Retrieve all transaction records from the database
      const partytransactions = await transactionmodel.find({party_id:req.params.id});
      // console.log(partytransactions);
      const itemtransactions = await transactionmodel.find({item_id:req.params.id});
      // console.log(itemtransactions);
      const allTransactions = [...partytransactions, ...itemtransactions];
      
      res.json(allTransactions);
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports={getallpartytransaction};