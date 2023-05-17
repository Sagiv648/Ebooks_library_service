import { Router } from "express";
import categoryModel from "../Models/category.js";
const router = Router();

router.get('/', async (req,res) => {

    try {
        const allCategories = await categoryModel.find();

        return res.status(200).json(allCategories)
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
})

export default router;