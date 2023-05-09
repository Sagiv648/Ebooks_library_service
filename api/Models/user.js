import {Schema, model} from "mongoose";

const schema = new Schema({
    email: String,
    password: String,
    uploaded_books: Array,
    uploaded_books_count: Number
})

const userModel = model("user", schema);

export default userModel