import { Request, Response } from "express";
import { getDashboardStats } from "../models/dashboardModel";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dashboard = await getDashboardStats();
    res.status(200).json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Dashboard error",
    });
  }
};