import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);
console.log(process.env.SERVER_URL);

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to Paid
// @route   PUT/api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  console.log(req.body);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Create session for Stripe
// @route   POST/api/orders/:id/pay
// @access  Private
const stripeSession = asyncHandler(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/order/${req.params.id}?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.SERVER_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
      // shipping_rate_data: {
      //   type: "fixed_amount",
      //   fixed_amount: {
      //     currency: "usd",
      //     amount: 50,
      //   },
      // },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// @desc    get Checkout Details From Stripe
// @route   GET/api/orders/:id/stripe/:checkout_id
// @access  Private
const checkoutDetails = asyncHandler(async (req, res) => {
  try {
    const id = req.params.checkout_id.toString();
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["payment_intent"],
    });
    res.json({
      session,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  stripeSession,
  checkoutDetails,
};
