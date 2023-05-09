import mongoose from "mongoose";
import dotenv from 'dotenv'
import {exit} from 'process'
dotenv.config();

export default async () => {

    try {
         await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(`Error\n${error.message}`);
        exit();
    }
   
}