import axios from "axios";

const API_URL = "/api/users";
const API_URL_LOGIN = "/api/users/login";
const API_URL_UPDATE = "/api/users/profile";

//Register User
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

//Login User
const login = async (userData) => {
  const response = await axios.post(API_URL_LOGIN, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

//Logout User
const logout = () => localStorage.removeItem("user");

//Update User
const userUpdate = async (userinfo) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  };
  const response = await axios.put(API_URL_UPDATE, userinfo, config);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  userUpdate,
};

export default authService;
