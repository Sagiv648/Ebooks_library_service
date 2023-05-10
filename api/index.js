
import app from "./config/networkConfig.js";
import userModel from "./Models/user.js";
import categoryModel from "./Models/category.js";
import bookModel from "./Models/book.js";
import bodyParser from "body-parser";
import userRouter from "./Controllers/user.js";
import cors from 'cors'
import booksRouter from "./Controllers/books.js";
import { auth } from "./Controllers/auth.js";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/books',auth, booksRouter)

app.use((req,res) => {
    
    return res.status(404).json({Resource: "doesn't exist"})
})