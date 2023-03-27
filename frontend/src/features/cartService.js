import axios from "axios";

const addToCart = async (id, qty) => {
  const response = await axios.get(`/api/products/${id}`);
  const data = await response.data;
  return {
    product: data._id,
    name: data.name,
    image: data.image,
    price: data.price,
    countInStock: data.countInStock,
    qty,
  };
};

const cartService = {
  addToCart,
};

export default cartService;
