import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hook/useAuthStatus";
import Loader from "./Loader";

const PrivateRoutes = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <Loader />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
