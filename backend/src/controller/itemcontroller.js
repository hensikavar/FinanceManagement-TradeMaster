const mongoose = require("mongoose");
const itemmodel = require("../model/item");
const { json } = require("express");

const additem = async (req,res)=>{
    const {item_id,item_name,item_category,item_code,item_HSN_SAC_CODE,item_saleprice,item_saleprice_disc,item_purchaseprice,item_purchaseprice_disc,item_taxes,item_stockqty}= req.body;
    if(!item_name || !item_category || !item_code){
        return res.status(422).json({error: "Please enter all required the fields {item name , category , item code}"});
    }

    try{
        const extistingitem = await itemmodel.findOne({item_name:item_name , item_code:item_code});
        if(extistingitem){
            return res.status(400).json({
                error:"Item already exists with this name or code"
            });
        }

        const newitem = new itemmodel({
            item_id:item_id,
            item_name:item_name,
            item_category:item_category,
            item_code:item_code,
            item_HSN_SAC_CODE:item_HSN_SAC_CODE,
            item_saleprice:item_saleprice,
            item_saleprice_disc:item_saleprice_disc,
            item_purchaseprice:item_purchaseprice,
            item_purchaseprice_disc:item_purchaseprice_disc,
            item_taxes:item_taxes,
            item_stockqty:item_stockqty
            //adminid:req.adminid,
        });

        await newitem.save();
        console.log('Item added successfully');
        res.status(201).json(newitem);
        // .send({message:"data added successfully"});
    }
    catch (error){
        console.log(error);
        res.status(400).send({message : "data is not added"})
    }
}

const edititem = async (req,res)=>{
    const {item_id,item_name,item_category,item_code,item_HSN_SAC_CODE,item_saleprice,item_saleprice_disc,item_purchaseprice,item_purchaseprice_disc,item_taxes,item_stockqty}= req.body;
     try {
        
        const upadteitem = await itemmodel.findOne({item_id:req.params.item_id})
        upadteitem.item_name = item_name;
        upadteitem.item_category =item_category;
        upadteitem.item_code = item_code;
        upadteitem.item_HSN_SAC_CODE = item_HSN_SAC_CODE;
        upadteitem.item_saleprice= item_saleprice;
        upadteitem.item_saleprice_disc = item_saleprice_disc;
        upadteitem.item_purchaseprice= item_purchaseprice;
        upadteitem.item_purchaseprice_disc = item_purchaseprice_disc;
        upadteitem.item_taxes= item_taxes;
        upadteitem.item_stockqty=item_stockqty;
        await upadteitem.save();
        console.log("Edited successfully");
        res.status(201).json(upadteitem);
        } 
        catch(error) {
            console.log(error);
            res.status(404)
            res.send({ error: "item dosen't exists"})
        }
    };

const deleteitem = async (req,res)=>{
    try {
        const delitem = await itemmodel.findOne({item_id:req.params.item_id})
        await delitem.deleteOne();
        res.status(202).json(delitem);
        } 
    catch(error) {
        res.status(404)
        console.log(error);
        res.send({ error: "Something went wrong" })
    }
}

const getitem = async (req,res)=>{
    try{
        const oneitem = await itemmodel.findOne({item_id:req.params.item_id});
        res.status(200).json(oneitem);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message : "data is not found"})
    }
}

const getAllitem = async (req,res)=>{
    allitem = await itemmodel.find();
    res.send(allitem);
};

module.exports = {additem,edititem,deleteitem,getitem,getAllitem};