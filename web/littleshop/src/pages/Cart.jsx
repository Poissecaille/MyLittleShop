import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
const BACKEND_CART_PRODUCTS_URL = "http://localhost:5000/cartProduct";
const SYNC_CART_BACKEND_URL = "http://localhost:5000/syncCart";
var initialCartPrice = 0;

const Cart = () => {
  const navigate = useNavigate();
  var [cartPrice, setCartPrice] = useState(initialCartPrice);
  //   var [cart, setCart] = useState(
  //     localStorage.getItem("cartProduct")
  //       ? JSON.parse(localStorage.getItem("cartProduct"))
  //       : []
  //   );
  var cart = localStorage.getItem("cartProduct")
    ? JSON.parse(localStorage.getItem("cartProduct"))
    : [];

  const [popup, setShowPopUp] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    new Promise((resolve) => {
      if (!localStorage.getItem("cartProduct")) {
        // setPopupTitle("LittleShop Cart management information");
        // setPopupContent(`No product is currently in your cart ${JSON.parse(localStorage["account"]).username}`)
        // popupHandler().then(() => {
        //     navigate("/products");
        // })
        axios
          .get(SYNC_CART_BACKEND_URL, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            //setCart(response.data.response);
            cart = response.data.response;
            resolve();
          })
          .catch((error) => {
            if (error.response.status === 403) {
              setPopupTitle("LittleShop account management information");
              setPopupContent("You are currently not logged in !");
              popupHandler().then(() => {
                localStorage.removeItem("login");
                navigate("/login");
              });
            }
          });
      }
      else{
          resolve()
      }
    }).then(() => {
      console.log("napoleon!!!", cart);
      localStorage.setItem("cartProduct", JSON.stringify(cart));
      if (cart.length === 0) {
        setPopupTitle("LittleShop Cart management information");
        setPopupContent(
          `No product is currently in your cart ${
            JSON.parse(localStorage["account"]).username
          } !`
        );
        popupHandler().then(() => {
          navigate("/products");
        });
      }
      for (let i = 0; i < cart.length; i++) {
        initialCartPrice += cart[i].unitPrice * cart[i].quantity;
        console.log("TESTEUUUH",typeof cart[i].quantity)
      }
      setCartPrice(initialCartPrice);
      navigate("/cart");
    });
  }, []);

  const popupHandler = (e) => {
    return new Promise((resolve, reject) => {
      setShowPopUp(!e);
      setTimeout(() => {
        setShowPopUp(false);
        resolve();
      }, 2000);
    });
  };

  const handleCartQuantity = (cartProduct) => (e) => {
    for (let i = 0; i < cart.length; i++) {
      if (cartProduct.id === cart[i].id) {
        if (!cart[i].unitPrice) {
          console.log(cartProduct);
          cart[i].unitPrice = cartProduct.unitPrice;
          //console.log(cart[i])
        }
        console.log(cart[i].quantity, Number(e.target.value));
        if (Number(cart[i].quantity) < Number(e.target.value)) {
          cart[i].quantity = Number(e.target.value);
          cartPrice += cart[i].unitPrice;
        } else {
          cart[i].quantity = Number(e.target.value);
          cartPrice -= cart[i].unitPrice;
        }
        localStorage["cartProduct"] = JSON.stringify(cart);
      }
    }
    if (cartPrice < 0) {
      cartPrice = 0;
    }
    initialCartPrice = 0;
    console.log(cartPrice);
    setQuantity(Number(e.target.value));
    setCartPrice(Number(cartPrice.toFixed(2)));
  };

  const removeProductFromCart = (data) => {
    axios
      .delete(BACKEND_CART_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      })
      .then(async (response) => {
        if (response.status === 200) {
          setPopupTitle("LittleShop Cart management information");
          setPopupContent(
            `${data.quantity} "${data.productName}" have been successfully removed from cart !`
          );
          for (let i = 0; i < cart.length; i++) {
            if (cart[i].productName === data.productName) {
              //delete cart[i];
              cart.splice(i, 1);
              localStorage["cartProduct"] = JSON.stringify(cart);
              console.log("##############");
              console.log(cart);
            }
          }
        }
        await popupHandler(popup);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const validateCart = () => {
    console.log(cart);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <Popup trigger={popup} title={popupTitle} value={popupContent} />
        {cart.map((cartProduct) => (
          <div className="cartProduct-card" key={cartProduct.id}>
            <div className="cartProduct-img">
              <img
                src={require("../images/box.png")}
                alt="standard cartProduct"
                width="200"
                height="200"
              />
            </div>
            <div className="card-cartProduct-header">
              <h2>{cartProduct.productName}</h2>
            </div>
            <div className="card-cartProduct-content">
              <p>
                <b>Seller: </b>
                {cartProduct.sellerUsername}
              </p>
              <p>
                <b>Label: </b>
                {cartProduct.label}
              </p>
              <p>
                <b>UnitPrice:</b> {cartProduct.unitPrice}
              </p>
              <p>
                <b>AvailableQuantity: </b>
                {cartProduct.availableQuantity}
              </p>
              <p>
                <b>Condition: </b>
                {cartProduct.condition}
              </p>
              <b>Quantity:</b>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                max={cartProduct.availableQuantity}
                defaultValue={cartProduct.quantity}
                onInput={handleCartQuantity(cartProduct)}
              ></input>
              <br />
              <button
                className="remove-cart-button"
                onClick={() =>
                  removeProductFromCart({
                    id: cartProduct.id,
                    productName: cartProduct.productName,
                    quantity: cartProduct.quantity,
                    sellerUsername: cartProduct.sellerUsername,
                  })
                }
              >
                Remove Product <MdCancel />
              </button>
            </div>
          </div>
        ))}
      </div>
      <h3>Cart summary</h3>
      <p>
        <b>Total Price: </b>
        {cartPrice != 0 ? cartPrice : initialCartPrice}
      </p>

      <button className="validate-cart-button" onClick={validateCart}>
        Validate cart <BsFillBagCheckFill />
      </button>
    </div>
  );
};

export default Cart;
