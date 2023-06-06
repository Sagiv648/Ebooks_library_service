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

//Password is hashed in the client
router.post('/signup', async (req,res) => {

    const {email, password, username, description} = req.body;
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
            username: username,
            description: description
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

//Password is hashed in the client
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
            id: exists._id,
            privilege: exists.privilege
        }, process.env.KEY)
        if(token)
        {
            
            return res.status(200).json({profile: {
                email: exists.email,
                avatar: exists.avatar,
                id: exists._id,
                username: exists.username,
                downloaded_books: exists.downloaded_books,
                uploaded_books: exists.uploaded_books,
                uploaded_books_count : exists.uploaded_books_count,
                description: exists.description},token: token})
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

    const {email,password, description, username} = req.data;
    const newUser = new userModel({email: email, password: password, description: description, username: username})

    const saved = await newUser.save();
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const html = fs.readFileSync(`${__dirname}/../emailVerified.html`).toString();
    return res.status(200).send(html)
    

})

router.post('/reset', async (req,res) => {
    const {email} = req.body;

    if(!email)
        return res.status(400).json({error: "invalid fields"})
    try {
        const generated_code = randomInt(100000,999999).toString();
        console.log(generated_code);
        const verificationPayload = jwt.sign({code: generated_code, email: email}, generated_code,{expiresIn: '15m'})
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

router.get('/permissions', auth, async (req,res) => {
    const {id} = req.data;

    try {
        const userRecord = await userModel.findById(id)
        return res.status(200).json({review_ban: userRecord.review_ban, upload_ban: userRecord.upload_ban})
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})


router.put('/profile', auth, async (req,res) => {
    const {id} = req.data;
    const data = req.body
    console.log("here?");
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id,data, {returnDocument: 'after'}).select('-password')
        if(!updatedUser)
            return res.status(500).json({error: "server error"})
        return res.status(200).json({profile:  {
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            _id: updatedUser._id,
            username: updatedUser.username,
            downloaded_books: updatedUser.downloaded_books,
            description: updatedUser.description
        }})
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

router.put('/:payload', async (req,res) => {
    const {payload} = req.params;
    console.log(payload);
    const {code,email,password} = req.body;
    console.log(req.body);
    if(!payload || !code || !email || !password)
        return res.status(400).json({error: "invalid fields"})

    try {
        jwt.verify(payload, code, async (err,payload) => {
            if(err)
                return res.status(401).json({error: "unauthorized"})
            
            else
            {
                const updated = await userModel.findOneAndUpdate({email: email}, {password: password}, {returnDocument: 'after'})
                if(updated)
                    return res.status(200).json({
                        updated: true
                    })
                return res.status(400).json({error: "no user with such email"})
            }
        })
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

router.get('/books', auth, async (req,res) => {

    const {id} = req.data;
    try {
        const details = await userModel.findById(id)
         .populate({path: 'uploaded_books', })
         .select('uploaded_books')
         .select("uploaded_books_count")
        
        if(details)
            return res.status(200).json(details)
        return res.status(400).json({error: "doesn't exist"})
    } 
    catch (error) {
        return res.status(500).json({error: error.message})
    }
})

router.get('/challenge', async (req,res) => {

    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))
        return res.status(401).json({error: "unauthorized"})
    const authorization = req.headers.authorization.split(' ')
    
    if(authorization.length != 2)
        return res.status(401).json({error: "unauthorized"})

    try {
        jwt.verify(authorization[1], process.env.KEY, async (err, payload) => {
            if(err)
                return res.status(401).json({error: "unauthorized"})

            const exists = await userModel.findById(payload.id)
            if(!exists)
                return res.status(401).json({error: "unauthorized"})
            if(exists.privilege === payload.privilege)
                return res.status(200).json({token: authorization[1]})
            const newPayload = {id: payload.id, privilege: exists.privilege}
            const newToken = jwt.sign(newPayload,process.env.KEY)
            return res.status(200).json({token: newToken})
        })
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

export default router;