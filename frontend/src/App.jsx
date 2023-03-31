import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/Login";
import Register from "./screens/Register";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} exact />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/profile" element={<PrivateRoutes />}>
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>
              <Route path="/shipping" element={<PrivateRoutes />}>
                <Route path="/shipping" element={<ShippingScreen />} />
              </Route>
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
