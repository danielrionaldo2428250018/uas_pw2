import express from "express";
import auth from "../middleware/auth.js";
import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase
} from "../controllers/purchaseController.js";

const router = express.Router();

/* GET ALL PURCHASES */
router.get("/", auth, getPurchases);

/* ADD PURCHASE */
router.post("/", auth, addPurchase);

/* UPDATE PURCHASE */
router.put("/:id", auth, updatePurchase);

/* DELETE PURCHASE */
router.delete("/:id", auth, deletePurchase);

export default router;
