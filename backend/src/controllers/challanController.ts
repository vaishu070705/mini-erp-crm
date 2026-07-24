import { Request, Response } from "express";
import {
  addChallanItem as addChallanItemModel,
  cancelChallan as cancelChallanModel,
  confirmChallan as confirmChallanModel,
  createChallan as createChallanModel,
  deleteChallanItem as deleteChallanItemModel,
  deleteChallan as deleteChallanModel,
  getChallanById as getChallanByIdModel,
  getChallanItems as getChallanItemsModel,
  getChallans,
  updateChallan as updateChallanModel,
} from "../models/challanModel";
import { ChallanInput, ChallanUpdateInput } from "../types/challan";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const toModelItems = (items: any[] = []) =>
  items.map((item) => ({
    product_id: Number(item.product_id),
    quantity: Number(item.quantity),
  }));

export const createChallan = async (req: Request, res: Response) => {
  try {
    const payload: ChallanInput = {
      customer_id: Number(req.body.customer_id),
      status: req.body.status || "Draft",
      created_by: Number(req.body.created_by),
      items: toModelItems(req.body.items),
    };

    const challan = await createChallanModel(payload);

    res.status(201).json({
      message: "Challan created successfully",
      challan,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const getAllChallans = async (_req: Request, res: Response) => {
  try {
    const challans = await getChallans();
    res.status(200).json(challans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch challans" });
  }
};

export const getChallanById = async (req: Request, res: Response) => {
  try {
    const challan = await getChallanByIdModel(Number(req.params.id));

    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    res.status(200).json(challan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch challan" });
  }
};

export const updateChallan = async (req: Request, res: Response) => {
  try {
    const existingChallan = await getChallanByIdModel(Number(req.params.id));

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

    const payload: ChallanUpdateInput = {
      customer_id: Number(req.body.customer_id),
      status: req.body.status || "Draft",
      items: toModelItems(req.body.items),
    };

    const challan = await updateChallanModel(Number(req.params.id), payload);

    res.status(200).json({
      message: "Challan updated successfully",
      challan,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const deleteChallan = async (req: Request, res: Response) => {
  try {
    const existingChallan = await getChallanByIdModel(Number(req.params.id));

    if (!existingChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    if (existingChallan.status !== "Draft") {
      return res.status(400).json({
        message: "Only draft challans can be deleted",
      });
    }

    await deleteChallanModel(Number(req.params.id));

    res.status(200).json({
      message: "Challan deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const confirmChallan = async (req: Request, res: Response) => {
  try {
    const existingChallan = await getChallanByIdModel(Number(req.params.id));

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

    const challan = await confirmChallanModel(Number(req.params.id));

    res.status(200).json({
      message: "Challan confirmed successfully",
      challan,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const cancelChallan = async (req: Request, res: Response) => {
  try {
    const existingChallan = await getChallanByIdModel(Number(req.params.id));

    if (!existingChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    if (existingChallan.status === "Cancelled") {
      return res.status(400).json({
        message: "Challan is already cancelled",
      });
    }

    const challan = await cancelChallanModel(Number(req.params.id));

    res.status(200).json({
      message: "Challan cancelled successfully",
      challan,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const addChallanItem = async (req: Request, res: Response) => {
  try {
    const result = await addChallanItemModel(
      Number(req.params.id),
      Number(req.body.product_id),
      Number(req.body.quantity)
    );

    res.status(201).json({
      message: "Challan item added successfully",
      item: result.item,
      total_quantity: result.total_quantity,
    });
  } catch (error) {
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

export const getChallanItems = async (req: Request, res: Response) => {
  try {
    const challan = await getChallanByIdModel(Number(req.params.id));

    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    const items = await getChallanItemsModel(Number(req.params.id));

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch challan items" });
  }
};

export const deleteChallanItem = async (req: Request, res: Response) => {
  try {
    const result = await deleteChallanItemModel(
      Number(req.params.id),
      Number(req.params.itemId)
    );

    res.status(200).json({
      message: "Challan item deleted successfully",
      deleted: result.deleted,
      total_quantity: result.total_quantity,
    });
  } catch (error) {
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
