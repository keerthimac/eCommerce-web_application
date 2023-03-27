import axios from "axios";

const listProducts = async () => {
  const response = await axios.get(`/api/products`);
  const data = await response.data;
  return data;
};

const getProduct = async (productId) => {
  const response = await axios.get(`/api/products/${productId}`);
  const data = await response.data;
  return data;
};

const productService = {
  listProducts,
  getProduct,
};

export default productService;
