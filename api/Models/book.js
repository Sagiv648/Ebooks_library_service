import { Schema,model } from "mongoose";

const schema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    downloads_count: {
        type: Number,
        default: 0
    },
    name: String,
    authors: Array,
    description: String,
    publish_date: Date,
    uploaded_at: {
        type: Date,
        default: Date.now
    },
    cover_image: String,
    download_url: String,
    report_count: {
        type: Number,
        default: 0
    }

})

const bookModel = model("book",schema);

export default bookModel;