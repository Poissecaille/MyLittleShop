import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductContainer from "../components/ProductContainer";

const BACKEND_PRODUCTS_URL = "http://localhost:5000/products";

const Products = () => {
  const [products, setProducts] = useState("");

  const productsBackEnd = async () => {
    try {
      const request = await axios.get(BACKEND_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(request.status);
      console.log(request.data.response);
      setProducts(request.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      
    </div>
  );
};

export default Products;
