
import app from "./config/networkConfig.js";
import userModel from "./Models/user.js";
import categoryModel from "./Models/category.js";
import bookModel from "./Models/book.js";
import bodyParser from "body-parser";
import userRouter from "./Controllers/user.js";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.use('/api/user', userRouter)


app.use((req,res) => {
    
    return res.status(404).json({Resource: "doesn't exist"})
})