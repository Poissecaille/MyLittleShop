import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Products from "./Products";
import Register from "./Register";
import Cart from "./Cart";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
