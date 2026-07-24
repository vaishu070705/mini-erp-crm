"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const dashboardModel_1 = require("../models/dashboardModel");
const getDashboard = async (req, res) => {
    try {
        const dashboard = await (0, dashboardModel_1.getDashboardStats)();
        res.status(200).json(dashboard);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Dashboard error",
        });
    }
};
exports.getDashboard = getDashboard;
