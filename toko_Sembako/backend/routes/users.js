import express from "express";
import auth from "../middleware/auth.js";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", auth, getUsers);
router.post("/", auth, addUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
