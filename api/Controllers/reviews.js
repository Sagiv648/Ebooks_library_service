import {Router} from 'express'
import { auth } from './auth.js';
import userModel from '../Models/user.js';
import reviewModel from '../Models/review.js';

const reviewRouter = Router()

reviewRouter.post('/',auth, async (req,res) => {
    const {id} = req.data;
    const {bookId, recommend, review_content} = req.body;

    if(!bookId || !review_content)
        return res.status(400).json({error: "invalid fields"})

    try {
        const userRecord = await userModel.findById(id)
        if(userRecord.review_ban)
            return res.status(403).json({error: "forbidden"})
        let reviewCreationObject = {user: id, book: bookId, review_content: review_content}
        if(recommend === true || recommend === false)
            reviewCreationObject.recommend = recommend
        
        const newReview = new reviewModel(reviewCreationObject)
        const savedNewReview = await newReview.save()

        if(!savedNewReview)
            return res.status(500).json({error: "server error"})
        const newRev =await  savedNewReview.populate({path: 'user', select: 'username avatar'})
            console.log(newRev);
        return res.status(201).json(newRev)
        
    } catch (error) {

        return res.status(500).json({error: "server error"})
    }
})


reviewRouter.get('/:bookId', async (req,res) => {
    const {bookId} = req.params;

    if(!bookId)
        return res.status(400).json({error: "invalid fields"})

    try {
        const reviewRecords = await reviewModel.find({book: bookId})
        .populate({path: 'user', select: 'avatar username'})

        return res.status(200).json({reviews: reviewRecords})
    } catch (error) {
        
        return res.status(500).json({error: "server error"})
    }
})



export default reviewRouter;