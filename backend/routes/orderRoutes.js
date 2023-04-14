import express from "express";

const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  stripeSession,
  checkoutDetails,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

router.post("/", protect, addOrderItems);
router.get("/:id", protect, getOrderById);
router.put("/:id/paid", protect, updateOrderToPaid);
router.post("/:id/stripe", protect, stripeSession);
router.get("/:id/stripe/:checkout_id", protect, checkoutDetails);

export default router;
