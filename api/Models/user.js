import {Schema, model} from "mongoose";

const schema = new Schema({
    email: String,
    password: String,
    uploaded_books: [{
        type: Schema.Types.ObjectId,
        ref: "book",
        default: []
    }],
    uploaded_books_count: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: ""
    }
})

const userModel = model("user", schema);

export default userModel