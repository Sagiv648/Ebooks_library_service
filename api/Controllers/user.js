import express from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../Models/user.js';
import { auth, emailTokenAuth } from './auth.js';
import transport from '../config/emailConfig.js'; 
import dotenv from 'dotenv'
import fs from 'fs'
import * as url from 'url'
import { randomBytes, randomInt } from 'crypto';
dotenv.config();
const router = express.Router();

router.post('/signup', async (req,res) => {

    const {email, password} = req.body;
    if(!email || !password)
        return res.status(400).json({error: "invalid fields"})
    try {
        const exists = await userModel.findOne({email: email})
        if(exists)
            return res.status(400).json({error: "exists"})
        

        const now = Date.now();
        const emailPayload = {
            email: email,
            password: password,
        }
        const emailToken = jwt.sign(emailPayload, process.env.EMAIL_CONFIRMATION_SECRET, {expiresIn: '15m'})
        if(!emailToken)
            return res.status(500).json({error: "server error"})
        
        const result = await transport.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "Email confirmation",
            html: `<p>We have sent you an email confirmation, you can accept it here <a href='http://${process.env.HOST}/api/user/confirm/${emailToken}'>Here</a></p>` +
            `<p>The email is valid for 15 minutes.</p>`
            })
        if(!result)
            return res.status(500).json({error: "error with mailing"})
        return res.status(200).json({email: "sent"})
        

    } 
    catch (err) {
        console.log(err.message);
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



router.get('/confirm/:payload', emailTokenAuth, async (req,res) => {
    
    const {a} = req.query;
    console.log(a);

    const {email,password} = req.data;
    const newUser = new userModel({email: email, password: password})

    const saved = await newUser.save();
    
    const token = jwt.sign({
        id: saved._id
    },process.env.KEY);
    if(token)
    {
        const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
        const html = fs.readFileSync(`${__dirname}/../emailVerified.html`).toString();
        return res.status(200).send(html)
        
    }
    else
        return res.status(500).json({error: "server error"})

})

router.post('/reset', async (req,res) => {
    const {email} = req.body;

    if(!email)
        return res.status(400).json({error: "invalid fields"})
    try {
        const generated_code = randomInt(0,100000).toString();
        console.log(generated_code);
        const verificationPayload = jwt.sign({code: generated_code}, generated_code,{expiresIn: '15m'})
        const result = await transport.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "Password restoration",
            html: `<p>Your password reset code is: ${generated_code}</p>` +
            `<p>The code is valid for 15 minutes.</p>`
            })
        if(!result)
            return res.status(500).json({error: "error with mailing"})
        return res.status(200).json({code_verification: verificationPayload})

    } catch (error) {
        
    }
})

router.get('/reset/:payload', )



router.get('/', auth, async (req,res) => {

    const {id} = req.data;
    try {
        const details = await userModel.findById(id).
        select('-__v').
        select('-password')
         .populate({path: 'uploaded_books', })
        
        if(details)
            return res.status(200).json(details)
        return res.status(400).json({error: "doesn't exist"})
    } 
    catch (error) {
        return res.status(500).json({error: error.message})
    }
})

export default router;