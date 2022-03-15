import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { BsSuitHeart, BsCart4 } from "react-icons/bs";
import "../style/Product.css";
import { capitalize } from "../utils/functions";

const BACKEND_PRODUCTS_URL = "http://localhost:5000/products";
const BACKEND_CART_PRODUCTS_URL = "http://localhost:5000/cartProduct";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [productName, setProductName] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [cartQuantity, setCartQuantity] = useState(null);
  //const [cartAdded, setCartAdded] = useState(false);
  //const [wishAdded, setWishAdded] = useState(false);
  const handleCartQuantity = (e) => {
    setCartQuantity(e.target.value);
  };
  const handleCondition = (e) => {
    setProductCondition(e.target.value);
  };
  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
  };
  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
  };
  const handleProductName = (e) => {
    setProductName(capitalize(e.target.value));
  };

  useEffect(() => {
    axios
      .get(BACKEND_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          lowerPrice: minPrice,
          higherPrice: maxPrice,
          productName: productName,
          condition: productCondition,
        },
      })
      .then((response) => {
        //console.log(response);
        setProducts(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [maxPrice, minPrice, productName, productCondition]);

  const addProductToCart = (data) => {
    console.log(data);
    axios
      .post(BACKEND_CART_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          productName: data.name,
          quantity: data.quantity,
          sellerUsername: data.seller,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="filters">
        <h3>filters</h3>
        <div className="gaug-price">
          <label>
            <b>min price: </b>
            {minPrice}$
          </label>
          <input
            type="range"
            onInput={handleMinPrice}
            id="minPrice"
            name="minPrice"
            min="0"
            max="1000"
          ></input>
          <label>
            <b>max price: </b>
            {maxPrice}$
          </label>
          <input
            type="range"
            onInput={handleMaxPrice}
            id="maxPrice"
            name="maxPrice"
            min="0"
            max="1000"
          ></input>
        </div>
        <div className="product-name">
          <label>
            <b>product name: </b>
          </label>
          <input
            type="text"
            onInput={handleProductName}
            id="productName"
            name="productName"
          ></input>
        </div>
        <div className="dropdown">
          <label>
            <b>condition</b>
          </label>
          <select
            name="conditions"
            id="conditions"
            onChange={handleCondition}
            value={productCondition}
          >
            <option value="new">new</option>
            <option value="occasion">occasion</option>
            <option value="renovated">renovated</option>
          </select>
        </div>
      </div>

      <div className="container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img">
              <img
                src={require("../images/box.png")}
                alt="standard product"
                width="200"
                height="200"
              />
            </div>
            <div className="card-header">
              <h2>{product.name}</h2>
            </div>
            <div className="card-content">
              <p>
                <b>Label: </b>
                {product.label}
              </p>
              <p>
                <b>Price: </b>
                {product.unitPrice}
              </p>
              <p>
                <b>AvailableQuantity: </b>
                {product.availableQuantity}
              </p>
              <p>
                <b>Condition: </b>
                {product.condition}
              </p>
              <p className="card-content-description">
                <b>Description: </b>
                {product.description}
              </p>
              <label>quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                max={product.availableQuantity}
                onInput={handleCartQuantity}
              ></input>
              <br></br>
              <button
                className="cart-button"
                onClick={() =>
                  addProductToCart({
                    productName: product.name,
                    quantity: cartQuantity
                  })
                }
              >
                Add to cart <BsCart4 />
              </button>
              <button className="wish-button">
                Add to whishlist <BsSuitHeart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
