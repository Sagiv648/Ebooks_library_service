import { Schema, model } from "mongoose";

const schema = new Schema({
    name: String
})

const categoryModel = model("category", schema);

export default categoryModel