import axios from "axios";

const API_URL = "/api/orders";

//create order
const orderCreate = async (order) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.post(API_URL, order, config);
  return response.data;
};

//Get order
const orderGet = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

//Stripe Session
const sessionStripe = async ({ orderId, orderBody }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}/${orderId}/stripe`,
    orderBody,
    config
  );
  return response.data;
};

//Get Checkout Details
const checkoutDetailsGet = async ({ orderId, checkoutId }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.get(
    `${API_URL}/${orderId}/stripe/${checkoutId}`,
    config
  );
  return response.data;
};

//Order Pay
const orderPay = async ({ orderId, paymentResult }) => {
  console.log(paymentResult, orderId);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.put(
    `${API_URL}/${orderId}/paid`,
    paymentResult,
    config
  );
  return response.data;
};

const orderService = {
  orderCreate,
  orderGet,
  orderPay,
  sessionStripe,
  checkoutDetailsGet,
};

export default orderService;
