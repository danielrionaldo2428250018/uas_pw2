import express from "express";
import auth from "../middleware/auth.js";
import { dashboardSummary } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", auth, dashboardSummary);

export default router;
