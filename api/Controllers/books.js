import express from 'express'
import userModel from '../Models/user.js';
import bookModel from '../Models/book.js';

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
        query.categories = {$in: [category]};
    }
    
    if(!query)
    {
        try {
            const allBooks = await bookModel.find()
            .populate({path: 'categories'})
            .select('-__v')
            return res.status(200).json(allBooks)
        } 
        catch (error) {
            console.log(error.message);
            return res.status(500).json({error: "server error"})
        }
    }
    else
    {
        try {
            const booksByQuery = await bookModel.find(query)
            .populate({path: 'categories'})
            .select('-__v')
            return res.status(200).json(booksByQuery)
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({error: "server error"})
        }
    }
    
})

router.get('/:bookId', async (req,res) => {
    const {bookId} = req.params;
    
    if(!bookId)
        return res.status(400).json({error: "invalid fields"});

    try {
        const bookById = await bookModel.findById(bookId)
        .populate({path: 'categories'})
        .select('-__v')
        return res.status(200).json({book: bookById})
    } 
    catch (error) {
        return res.status(500).json({error: "server error"})
    }

})

router.post('/', async (req,res) => {
    const {categories, 
        name,
        authors,
        description,
        publish_date,
        cover_image,
        download_url} = req.body;
        const {id} = req.data;
        if(!categories || !name || !download_url)
            return res.status(400).json({error: "invalid fields"})

        try {
            const book = new bookModel
            (
                {
                    name: name,
                    authors: authors,
                    categories: categories,
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
                
                .populate({path: "uploaded_books",
                            populate: {
                                path: 'categories'
                            }})
                .select('-__v')
                .select('-password')

            if(!user)
                return res.status(500).json({error: "server error"})
            
            

            return res.status(201).json({book: newBook})
            
        } 
        catch (error) {
            return res.status(500).json({error: "server error"})
        }
        
})

export default router;