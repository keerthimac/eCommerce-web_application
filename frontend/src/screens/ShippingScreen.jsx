import React from "react";
import {
  Link,
  useParams,
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";

const ShippingScreen = () => {
  const location = useLocation();
  console.log(location);
  return <div>ShippingScreen</div>;
};

export default ShippingScreen;
