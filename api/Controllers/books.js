import express from 'express'
import userModel from '../Models/user.js';
import bookModel from '../Models/book.js';
import { auth } from './auth.js';
import mongoose from 'mongoose';
import categoryModel from '../Models/category.js';
const router = express.Router();


router.get('/', async (req,res) => {

    const {name, category} = req.query;
    let query = {}
    if(name)
    {
        query.name = {$regex: name}
    }
    if(category)
    {
        query.category = category;
    }
    
    try {
        const allBooksByQuery = await bookModel.find(query)
        .populate({path: 'user', select: 'username avatar description'})
        .populate({path: 'category'})
        .select('-report_count')
        
        
        
        return res.status(200).json(allBooksByQuery)
    } 
    catch (error) {
        console.log(error.message);
        return res.status(500).json({error: "server error"})
    }

    
    
})

router.get('/:bookId', async (req,res) => {
    const {bookId} = req.params;
    console.log("does it get here?");
    if(!bookId || !mongoose.isValidObjectId(bookId))
        return res.status(400).json({error: "invalid fields"});

    try {
        const bookById = await bookModel.findById(bookId)
        .populate({path: 'user', select: 'email avatar'})
        .populate({path: 'category'})
        .select('-report_count')
        .select('-__v')
        return res.status(200).json({book: bookById})
    } 
    catch (error) {
        console.log(error.message);
        return res.status(500).json({error: "server error"})
    }

})


router.delete('/:bId', auth, async (req,res) => {
    const {bId} = req.params;
    const {id} = req.data;
    
    if(!bId)
        return res.status(400).json({error: "invalid fields"})
    try {
        const deleted = await bookModel.findByIdAndDelete(bId,{returnDocument: 'after'})
        if(!deleted)
            return res.status(400).json({error: "invalid id"})
        const user = await userModel.findById(id)
        await user.uploaded_books.pull({_id: bId})
        
        return res.status(200).json({book: deleted})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'server error'})
    }
})


//Potential use of SOCKET IO for real time downloads update
router.put('/', auth, async (req,res) => {
    const {id} = req.data;
    const {downloaded_books} = req.body;
    if(!downloaded_books)
        return res.status(400).json({error: "invalid fields"})
    try {
        



        downloaded_books.map(async (entry) => {
            await bookModel.findByIdAndUpdate(entry, {$inc: {downloads_count: 1}})
        })
        const user = await userModel.findByIdAndUpdate(id, {$push: {downloaded_books: downloaded_books}})
        if(!user)
            return res.status(400).json({error: "invalid ids"})
        
        return res.status(200).json(downloaded_books)
        
    } catch (error) {
        
        return res.status(500).json({error: "server error"})
    }
})


router.put('/report/:bookId', auth, async (req,res) => {
    const {bookId} = req.params;

    if(!bookId)
        return res.status(400).json({error: "invalid fields"})

    const {id} = req.data;

    try {
        const boookRecord = await bookModel.findByIdAndUpdate(bookId, {$inc: {report_count: 1}},{returnDocument: 'after'})
        if(!boookRecord)
            return res.status(400).json({error: "invalid id"})
        return res.status(200).json({book: bookId})

    } catch (error) {

        return res.status(500).json({error: "server error"})
    }
})

router.post('/',auth ,async (req,res) => {
    const {category, 
        name,
        authors,
        description,
        publish_date,
        cover_image,
        download_url} = req.body;
        const {id} = req.data;
        if(!category || !name || !download_url)
            return res.status(400).json({error: "invalid fields"})

        try {

            const userRecord = await userModel.findById(id)
            if(userRecord.upload_ban)
                return res.status(403).json({error: "banned"})

            const book = new bookModel
            (
                {
                    name: name,
                    authors: authors,
                    category: category,
                    description: description,
                    publish_date: publish_date,
                    cover_image: cover_image,
                    download_url: download_url,
                    user: id
                }
            )
            const newBook = await book.save();
            
            if(!newBook)
                return res.status(500).json({error: "server error"})

            const user = await userModel.findByIdAndUpdate(id, 
                {$push: {uploaded_books: newBook},
                $inc: {uploaded_books_count: 1}},{returnDocument: 'after'})
                
                
            if(!user)
                return res.status(500).json({error: "server error"})
            
            
            const bookToReturn = await newBook.populate({path: 'category'})
            const categoryRecord = await categoryModel.findByIdAndUpdate(category, {$inc: {books_count: 1}}, {returnDocument: 'after'})
            console.log(bookToReturn);
            return res.status(201).json({book: bookToReturn})
            
        } 
        catch (error) {
            
            return res.status(500).json({error: "server error"})
        }
        
})

router.put('/report/:bookId',auth ,async (req,res) => {
    const {bookId} = req.params;
    const {id} = req.data;
    console.log("x");
    if(!bookId)
        return res.status(400).json({error: "invalid fields"})
    
    try {
        const bookRecord = await bookModel.findByIdAndUpdate(bookId, {$inc: {report_counts: 1}},{returnDocument :'after'})
        if(!bookRecord)
            return res.status(400).json({error: "invalid review"})
        return res.status(200).json({book: bookId})
    } catch (error) {
        
        return res.status(500).json({error: "server error"})
    }
})

export default router;