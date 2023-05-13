import express from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../Models/user.js';
import { auth } from './auth.js';
const router = express.Router();

router.post('/signup', async (req,res) => {

    const {email, password} = req.body;
    if(!email || !password)
        return res.status(400).json({error: "invalid fields"})
    try {
        const exists = await userModel.findOne({email: email})
        if(exists)
            return res.status(400).json({error: "exists"})
        
        const newUser = new userModel({email: email, password: password})

        const saved = await newUser.save();
        const token = jwt.sign({
            id: saved._id
        },process.env.KEY);
        if(token)
        {
            return res.status(201).json({profile: {
                email: newUser.email,
                avatar: newUser.avatar,
                id: newUser._id,
                uploaded_books: newUser.uploaded_books,
                uploaded_books_count: newUser.uploaded_books_count},token: token})
        }
        else
            return res.status(500).json({error: "server error"})

    } 
    catch (err) {
        
        return res.status(500).json({error: "server error"})
    }
    
        

})

router.post('/signin', async (req,res) => {
    
    const {email, password} = req.body;
    
    if(!email || !password)
        return res.status(400).json({error: "invalid fields"})

    try {
        const exists = await userModel.findOne({email: email})
        
        
        if(!exists)
            return res.status(400).json({error: "invalid credentials"})
            
        if(password != exists.password)
            return res.status(400).json({error: "invalid credentials"})
        const token = jwt.sign({
            id: exists._id
        }, process.env.KEY)
        if(token)
        {
            
            return res.status(200).json({profile: {
                email: exists.email,
                avatar: exists.avatar,
                id: exists._id,
                uploaded_books: exists.uploaded_books,
                uploaded_books_count: exists.uploaded_books_count},token: token})
        }
        else
            return res.status(500).json({error: "server error"})
    } 
    catch (error) {
        return res.status(500).json({error: "server error"})
    }

})

router.get('/', auth, async (req,res) => {

    const {id} = req.data;
    try {
        const details = await userModel.findById(id).
        select('-__v').
        select('-password')
         .populate(
            {
                path: 'uploaded_books', 
                populate: 
                {
                    path: 'categories'
                },
        })
        
        if(details)
            return res.status(200).json(details)
        return res.status(400).json({error: "doesn't exist"})
    } 
    catch (error) {
        return res.status(500).json({error: error.message})
    }
})

export default router;