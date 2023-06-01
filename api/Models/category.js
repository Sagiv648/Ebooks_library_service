import { Schema, model } from "mongoose";

const schema = new Schema({
    name: String,
    books_count: {
        type: Number,
        default: 0
    }
})

const categoryModel = model("category", schema);

export default categoryModel