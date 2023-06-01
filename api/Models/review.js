import {Schema,model} from 'mongoose'


const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book'
    },
    recommend: {
        type: Boolean
    },
    review_content: {
        type: String,
        required: true
    },
    report_counts: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const reviewModel = model("review", reviewSchema)
export default reviewModel