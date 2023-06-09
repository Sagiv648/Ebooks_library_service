import {Schema, model} from "mongoose";

const schema = new Schema({
    email: String,
    password: String,
    username: {
        type: String,
        default: "N/A"
    },
    privilege: {
        type: Number,
        default: 2
    },
    description: String,
    uploaded_books: [{
        type: Schema.Types.ObjectId,
        ref: "book",
        default: []
    }],
    uploaded_books_count: {
        type: Number,
        default: 0
    },
    downloaded_books: [{
        type: Schema.Types.ObjectId,
        ref: "book",
        default: []
    }],
    avatar: {
        type: String,
        default: ""
    },
    review_ban: {
        type: Boolean,
        default: false
    },
    upload_ban: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const userModel = model("user", schema);

export default userModel