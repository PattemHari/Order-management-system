import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import NavbarComponent from "./component/ui/NavBar";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./pages/AddProdect";
import AcceptRequestsList from "./pages/AcceptOrders";
import ActiveOrders from "./pages/ActiveOrders";
import DeliveryHistory from "./pages/DeliveryHistory";

const App: React.FC = () => {

  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/accept-orders" element={<AcceptRequestsList />} />
          <Route path="/active-orders" element={<ActiveOrders />} />
          <Route path="/delivery-history" element={<DeliveryHistory />} />

        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
