import ProductCategory from "../models/productCategory.js";
const getAllCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting categories" });
    }
}

export {getAllCategories};