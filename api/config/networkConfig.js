import express from 'express'
import http from 'http'
import https from 'https'
import mongoose from 'mongoose';
import { exit } from 'process';
import dotenv from 'dotenv'
import dbConfig from './dbConfig.js';


dotenv.config();
dbConfig();
const app = express();

mongoose.connection.once("open", () => {
    
    try {
        
        const httpServer = http.createServer(app).listen(3001);
        

    } catch (error) {
        console.log(`Server error\n${error.message}`);
        exit();
    }
    
})

mongoose.connection.on("error", (err) => {
    console.log(`MongoDB error\n${err.message}`);
    exit();
})
export default app;


