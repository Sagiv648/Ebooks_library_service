
import app from "./config/networkConfig.js";
import userModel from "./Models/user.js";
import categoryModel from "./Models/category.js";
import bookModel from "./Models/book.js";
import bodyParser from "body-parser";
import userRouter from "./Controllers/user.js";
import cors from 'cors'
import booksRouter from "./Controllers/books.js";
import { auth, emailTokenAuth, isPrivileged } from "./Controllers/auth.js";
import categoryRouter from "./Controllers/categories.js";
import adminRouter from "./Controllers/admin.js";
import reviewRouter from "./Controllers/reviews.js";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.use('/api/user', userRouter)



app.use('/api/reviews', reviewRouter)
app.use('/api/books', booksRouter)
app.use('/api/categories', categoryRouter);
app.use('/api/admin',auth, isPrivileged ,adminRouter)
app.use((req,res) => {
    
    return res.status(404).json({Resource: "doesn't exist"})
})