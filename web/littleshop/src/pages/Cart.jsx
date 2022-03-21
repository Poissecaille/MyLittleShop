import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const BACKEND_CART_PRODUCTS_URL = "http://localhost:5000/cartProduct";

const Cart = () => {
 var cartProduct = localStorage.getItem('cartProduct');
  console.log(cartProduct)
if(cartProduct) {
     cartProduct = JSON.parse(cartProduct);
} else {
    cartProduct = [];
    localStorage.setItem('cartProduct', JSON.stringify(cartProduct));
}

  //const [cartProducts, setCartProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(BACKEND_CART_PRODUCTS_URL, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => {
//         console.log(response);
//         setCartProducts(response.data.response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });
  return (
    <div>
      <Navbar />
      {/* <div className="container">
        {cartProducts.map((productCart) => (
          <div className="product-card" key={productCart.id}>
            <img
              src={require("../images/box.png")}
              alt="standard product"
              width="200"
              height="200"
            />
          </div>
          <div className="card-header">
              <h2>{productCart.name}</h2>
          </div>
        ))}
      </div> */}
    </div>
  );
};
export default Cart;
