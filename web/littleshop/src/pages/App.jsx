import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Products from "./Products";
import Register from "./Register";
import Cart from "./Cart";
import Logout from "./Logout";
import Account from "./Account";
import Addresses from "./Addresses";
import Order from "./Orders";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/addresses" element={<Addresses />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/orders" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default App;
