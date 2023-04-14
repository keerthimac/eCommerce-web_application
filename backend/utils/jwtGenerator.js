import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtGenerator = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  const payload = { id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
  return token;
};

export default jwtGenerator;
