import Product from "../models/product.js";
import mongoose from "mongoose";
import ProductCategory from "../models/productCategory.js";
const getAllProducts = async (req, res) => {
  try {
    const sort = req.query.sort;
    const limit = req.query.limit;
    const products = await Product.find().sort(sort).limit(limit).exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting product" });
  }
};

const createProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let { image, title, description, price, category, brand, count } =
      req.body;
     category = category.toLowerCase();
     brand = brand.toLowerCase();
    const newProduct = new Product({
      image,
      title,
      description,
      price,
      category,
      brand,
      count,
    });

    const newProductCategory = newProduct.category;
    const categoryExists = await ProductCategory.findOne({
      name: newProductCategory,
    });
    if (!categoryExists) {
      const newCategory = new ProductCategory({ name: newProductCategory });
      await newCategory.save({ session });
    }

    await newProduct.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let { image, title, description, price, category, brand, count } =
      req.body;
    if (category) {
    category = category.toLowerCase();}
    if (brand) {
      brand = brand.toLowerCase();
    }
    const oldProduct = await Product.findById(req.params.id);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        description,
        price,
        category,
        brand,
        count,
      },
      {
        new: true,
        session,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (category) {
    const categoryExists = await ProductCategory.findOne({ name: category });
    if (!categoryExists) {
      const newCategory = new ProductCategory({ name: category });
      await newCategory.save({ session });
    }
    const productCategoryExist = await Product.findOne({
      category: oldProduct.category,
    });
    if (!productCategoryExist) {
      await ProductCategory.findOneAndDelete(
        { name: oldProduct.category },
        { session }
      );
    }}

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const oldProduct = await Product.findById(req.params.id);
    const productCategoryExist = await Product.findOne({
      category: oldProduct.category,
    });
    if (!productCategoryExist) {
      await ProductCategory.findOneAndDelete(
        { name: oldProduct.category },
        { session }
      );
    }
    const product = await Product.findByIdAndDelete(req.params.id, { session });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const searchProduct = async (req, res) => {
  try {
    const search = req.query.search;
    const limit = req.query.limit;
    const regex = new RegExp(search, "i");
    const products = await Product.find({ title: { $regex: regex } }).limit(
      limit
    );
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error products" });
  }
};
const getProductByCategory = async (req, res) => {
  try {
    
    const limit = req.query.limit;
    const sort = req.query.sort;
    const page= req.query.page || 0;
    const category = req.params.category;
    const brand = req.query.brand || null;
    
    const query={category}
    if (brand) {
      
      query.brand = brand.toLowerCase();
    }
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query)
    .limit(limit)
    .skip(page * limit)
    .sort(sort);
    res.status(200).json({ products, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting products" });
  }
};
const getBrandsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });
    const brands=[
      ...new Set(products.map((product)=> product.brand.toUpperCase()))
    ]
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting brands" });
    
  }
}

export {
  getBrandsByCategory,
  getProductByCategory,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
