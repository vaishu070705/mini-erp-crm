"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProduct = exports.editProduct = exports.createNewProduct = exports.getSingleProduct = exports.getAllProducts = void 0;
const productModel_1 = require("../models/productModel");
// Get all products
const getAllProducts = async (_req, res) => {
    try {
        const products = await (0, productModel_1.getProducts)();
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getAllProducts = getAllProducts;
// Get single product
const getSingleProduct = async (req, res) => {
    try {
        const product = await (0, productModel_1.getProductById)(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
exports.getSingleProduct = getSingleProduct;
// Create product
const createNewProduct = async (req, res) => {
    try {
        const { product_name, sku, category, unit_price, current_stock, minimum_stock_alert, warehouse_location, } = req.body;
        const product = await (0, productModel_1.createProduct)(product_name, sku, category, Number(unit_price), Number(current_stock), Number(minimum_stock_alert), warehouse_location);
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
};
exports.createNewProduct = createNewProduct;
// Update product
const editProduct = async (req, res) => {
    try {
        const { product_name, unit_price, current_stock } = req.body;
        const product = await (0, productModel_1.updateProduct)(Number(req.params.id), product_name, Number(unit_price), Number(current_stock));
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update product" });
    }
};
exports.editProduct = editProduct;
// Delete product
const removeProduct = async (req, res) => {
    try {
        await (0, productModel_1.deleteProduct)(Number(req.params.id));
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};
exports.removeProduct = removeProduct;
