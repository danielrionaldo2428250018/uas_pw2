import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getItems,
  addItem,
  updateItemQty,
  deleteItem,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

router.get("/:id/items", getItems);
router.post("/item", addItem);
router.put("/item/:id", updateItemQty);
router.delete("/item/:id", deleteItem);

export default router;
