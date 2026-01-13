import express from "express";
import auth from "../middleware/auth.js";
import {
  getPurchases,
  addPurchase,
  deletePurchase,
  getPurchaseItems,
  addPurchaseItem,
  deletePurchaseItem
} from "../controllers/purchaseController.js";

const router = express.Router();

router.get("/", auth, getPurchases);
router.post("/", auth, addPurchase);
router.delete("/:id", auth, deletePurchase);

router.get("/:id/items", auth, getPurchaseItems);
router.post("/item", auth, addPurchaseItem);
router.delete("/item/:id", auth, deletePurchaseItem);

export default router;
