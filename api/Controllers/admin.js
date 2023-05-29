import { Router } from "express";
import userModel from "../Models/user.js";
import { isRingZero } from "./auth.js";
import categoryModel from "../Models/category.js";
import bookModel from "../Models/book.js";

const adminRouter = Router()


adminRouter.get('/users', async (req,res) => {
    const {id} = req.data;

    try {
        const allUsers = await userModel.find().select('-password')
        if(!allUsers)
            return res.status(500).json({error: "server error"})
        return res.status(200).json(allUsers)
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

adminRouter.put('/users/:userId', isRingZero ,async (req,res) => {
    const {id} = req.data;
    const {userId} = req.params;
    if(!userId)
        return res.status(400).json({error:"invalid fields"})
    try {
        const userById = await userModel.findByIdAndUpdate(userId, {privilege: 1})
        .select("email")
        .select("_id")
        .select("username")
        
        if(!userById)
            return res.status(400).json({error: "invalid user"})
        return res.status(200).json({userById})
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})
adminRouter.post('/categories', async(req,res) => {
    const {name} = req.body;
    const {id} = req.data;

    if(!name)
        return res.status(400).json({error : "invalid fields"})
    try {

        const existingCategory = await categoryModel.findOne({name: name})
        if(existingCategory)
            return res.status(400).json({error: "existing category"})

        const newCategory = new categoryModel({name: name})
        const savedCategory = await newCategory.save()
        
        if(!savedCategory)
            return res.status(500).json({error: "server error"})
        return res.status(201).json({savedCategory})
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

adminRouter.delete('/categories', async (req,res) => {
    
    const {removed_category, replacement_category} = req.query;
    const {id} = req.data;

    if(!removed_category || !replacement_category)
        return res.status(400).json({error: "invalid fields"})
    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(removed_category,{returnDocument: 'after'})
        if(!deletedCategory)
            return res.status(400).json({error: "invalid category"})
        const updateResult = await bookModel.updateMany({category: deletedCategory},{category: replacement_category})
        if(!updateResult)
            return res.status(500).json({error: "server error"})
        return res.status(200).json({result: updateResult})
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

export default adminRouter