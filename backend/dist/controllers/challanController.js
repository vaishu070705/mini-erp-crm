"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChallanItem = exports.getChallanItems = exports.addChallanItem = exports.cancelChallan = exports.confirmChallan = exports.deleteChallan = exports.updateChallan = exports.getChallanById = exports.getAllChallans = exports.createChallan = void 0;
const challanModel_1 = require("../models/challanModel");
const getErrorMessage = (error) => error instanceof Error ? error.message : "Something went wrong";
const toModelItems = (items = []) => items.map((item) => ({
    product_id: Number(item.product_id),
    quantity: Number(item.quantity),
}));
const createChallan = async (req, res) => {
    try {
        const payload = {
            customer_id: Number(req.body.customer_id),
            status: req.body.status || "Draft",
            created_by: Number(req.body.created_by),
            items: toModelItems(req.body.items),
        };
        const challan = await (0, challanModel_1.createChallan)(payload);
        res.status(201).json({
            message: "Challan created successfully",
            challan,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.createChallan = createChallan;
const getAllChallans = async (_req, res) => {
    try {
        const challans = await (0, challanModel_1.getChallans)();
        res.status(200).json(challans);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch challans" });
    }
};
exports.getAllChallans = getAllChallans;
const getChallanById = async (req, res) => {
    try {
        const challan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!challan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        res.status(200).json(challan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch challan" });
    }
};
exports.getChallanById = getChallanById;
const updateChallan = async (req, res) => {
    try {
        const existingChallan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!existingChallan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (existingChallan.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled challans cannot be edited",
            });
        }
        if (existingChallan.status === "Confirmed") {
            return res.status(400).json({
                message: "Confirmed challans cannot be edited. Cancel it first.",
            });
        }
        const payload = {
            customer_id: Number(req.body.customer_id),
            status: req.body.status || "Draft",
            items: toModelItems(req.body.items),
        };
        const challan = await (0, challanModel_1.updateChallan)(Number(req.params.id), payload);
        res.status(200).json({
            message: "Challan updated successfully",
            challan,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.updateChallan = updateChallan;
const deleteChallan = async (req, res) => {
    try {
        const existingChallan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!existingChallan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (existingChallan.status !== "Draft") {
            return res.status(400).json({
                message: "Only draft challans can be deleted",
            });
        }
        await (0, challanModel_1.deleteChallan)(Number(req.params.id));
        res.status(200).json({
            message: "Challan deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.deleteChallan = deleteChallan;
const confirmChallan = async (req, res) => {
    try {
        const existingChallan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!existingChallan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (existingChallan.status === "Confirmed") {
            return res.status(400).json({
                message: "Challan is already confirmed",
            });
        }
        if (existingChallan.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled challans cannot be confirmed",
            });
        }
        const challan = await (0, challanModel_1.confirmChallan)(Number(req.params.id));
        res.status(200).json({
            message: "Challan confirmed successfully",
            challan,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.confirmChallan = confirmChallan;
const cancelChallan = async (req, res) => {
    try {
        const existingChallan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!existingChallan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (existingChallan.status === "Cancelled") {
            return res.status(400).json({
                message: "Challan is already cancelled",
            });
        }
        const challan = await (0, challanModel_1.cancelChallan)(Number(req.params.id));
        res.status(200).json({
            message: "Challan cancelled successfully",
            challan,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.cancelChallan = cancelChallan;
const addChallanItem = async (req, res) => {
    try {
        const result = await (0, challanModel_1.addChallanItem)(Number(req.params.id), Number(req.body.product_id), Number(req.body.quantity));
        res.status(201).json({
            message: "Challan item added successfully",
            item: result.item,
            total_quantity: result.total_quantity,
        });
    }
    catch (error) {
        console.error(error);
        if (getErrorMessage(error) === "Challan not found") {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (getErrorMessage(error) === "Product not found") {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.addChallanItem = addChallanItem;
const getChallanItems = async (req, res) => {
    try {
        const challan = await (0, challanModel_1.getChallanById)(Number(req.params.id));
        if (!challan) {
            return res.status(404).json({ message: "Challan not found" });
        }
        const items = await (0, challanModel_1.getChallanItems)(Number(req.params.id));
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch challan items" });
    }
};
exports.getChallanItems = getChallanItems;
const deleteChallanItem = async (req, res) => {
    try {
        const result = await (0, challanModel_1.deleteChallanItem)(Number(req.params.id), Number(req.params.itemId));
        res.status(200).json({
            message: "Challan item deleted successfully",
            deleted: result.deleted,
            total_quantity: result.total_quantity,
        });
    }
    catch (error) {
        console.error(error);
        if (getErrorMessage(error) === "Challan not found") {
            return res.status(404).json({ message: "Challan not found" });
        }
        if (getErrorMessage(error) === "Challan item not found") {
            return res.status(404).json({ message: "Challan item not found" });
        }
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
exports.deleteChallanItem = deleteChallanItem;
