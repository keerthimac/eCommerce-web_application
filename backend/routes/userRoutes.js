import express from "express";

const router = express.Router();
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUser);
router.put("/profile", protect, updateUser);

export default router;
