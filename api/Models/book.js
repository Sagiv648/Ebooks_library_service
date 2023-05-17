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
    name: String,
    authors: Array,
    description: String,
    publish_date: Date,
    cover_image: String,
    download_url: String

})

const bookModel = model("book",schema);

export default bookModel;