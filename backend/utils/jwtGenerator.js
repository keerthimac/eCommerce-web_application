import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const jwtGenerator = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  const payload = { id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
  return token;
};

export default jwtGenerator;
