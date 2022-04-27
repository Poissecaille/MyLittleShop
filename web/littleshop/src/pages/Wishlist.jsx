import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
//localStorage.removeItem("wishProduct")
import ReactStars from "react-rating-stars-component";
import { BsCart4 } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
//localStorage.removeItem("wishProduct")
const WishList = () => {
  const BACKEND_WISHLIST_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/wishProducts`;
  const BACKEND_WISHLIST_URL_CRUD = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/wishProduct`;
  const BACKEND_CART_PRODUCTS_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/cartProduct`;

  const [quantity, setQuantity] = useState(0);
  var wishs = localStorage.getItem("wishProduct")
    ? JSON.parse(localStorage.getItem("wishProduct"))
    : [];
  console.log(wishs);

  const navigate = useNavigate();
  const [popup, setShowPopUp] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const popupHandler = (e) => {
    return new Promise((resolve, reject) => {
      setShowPopUp(!e);
      setTimeout(() => {
        setShowPopUp(false);
        resolve();
      }, 2000);
    });
  };

  const handleWishProductQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const removeProductFromWishList = (data) => {
    axios
      .delete(BACKEND_WISHLIST_URL_CRUD, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      })
      .then(async (response) => {
        if (response.status === 200) {
          setPopupTitle("LittleShop Wishlist management information");
          setPopupContent(
            `"${data.productName}" have been successfully removed from wishlist !`
          );
          for (let i = 0; i < wishs.length; i++) {
            if (wishs[i].productName === data.name) {
              wishs.splice(i, 1);
              localStorage["wishProduct"] = JSON.stringify(wishs);
            }
          }
        }
        await popupHandler(popup);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addProductToCart = (data) => {
    axios
      .post(
        BACKEND_CART_PRODUCTS_URL,
        {
          productName: data.productName,
          quantity: data.quantity,
          sellerUsername: data.sellerUsername,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(async (response) => {
        if (response.status === 201) {
          if (localStorage.getItem("cartProduct") === null) {
            localStorage.setItem("cartProduct", "[]");
          }
          var oldCart = JSON.parse(localStorage.getItem("cartProduct"));
          console.log(oldCart);

          oldCart.push({
            id: data.id,
            productName: data.productName,
            label: data.label,
            quantity: data.quantity,
            sellerUsername: data.sellerUsername,
            unitPrice: data.unitPrice,
            condition: data.condition,
            availableQuantity: data.availableQuantity,
          });
          localStorage.setItem("cartProduct", JSON.stringify(oldCart));
          setPopupTitle("LittleShop product management information");
          setPopupContent(
            `${data.quantity} "${data.productName}" have been successfully added to cart !`
          );
          await popupHandler(popup);
          //window.location.reload()
        }
      })
      .catch(async (error) => {
        if (error.response.status === 409) {
          setPopupTitle("LittleShop product management information");
          setPopupContent(` "${data.productName}" is already inside cart !`);
          await popupHandler(popup);
        } else if (error.response.status === 400) {
          setPopupTitle("LittleShop product management information");
          setPopupContent(
            "Something went wrong don't forget to add a quantity"
          );
          await popupHandler(popup);
        }
      });
  };

  useEffect(() => {
    if (!wishs || wishs.length === 0) {
      axios
        .get(BACKEND_WISHLIST_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          var oldWishs = JSON.parse(localStorage.getItem("wishProduct"));
          oldWishs.push(response.data.response);
          wishs = oldWishs;
          localStorage.setItem("wishProduct", JSON.stringify(wishs));
          console.log(wishs);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            setPopupTitle("LittleShop account management information");
            setPopupContent("You are currently not logged in !");
            popupHandler().then(() => {
              localStorage.removeItem("login");
              navigate("/login");
            });
          } else if (error.response.status === 404) {
            setPopupTitle("LittleShop account management information");
            setPopupContent("You don't have any product in your wishlist!");
            popupHandler().then(() => {
              navigate("/products");
            });
          }
        });
    }
  });
  return (
    <>
      <Navbar />
      <div className="container">
        <Popup trigger={popup} title={popupTitle} value={popupContent} />
        {wishs.map((wishProduct) => (
          <div className="product-card" key={wishProduct.id}>
            <div className="product-img">
              <img
                src={require("../images/box.png")}
                alt="standard wishProduct"
                width="200"
                height="200"
              />
            </div>
            <div className="card-header">
              <h2>{wishProduct.name}</h2>
            </div>
            <div className="card-content">
              <p>
                <b>Seller: </b>
                {wishProduct.sellerUsername}
              </p>
              <p>
                <b>Label: </b>
                {wishProduct.label}
              </p>
              <p>
                <b>Price: </b>
                {wishProduct.unitPrice}
              </p>
              <p>
                <b>Quantity: </b>
                {wishProduct.quantity}
              </p>
              <p>
                <b>Condition: </b>
                {wishProduct.condition}
              </p>
              <p>
                <b>Categories:</b>
                {wishProduct.categories.map((category) => (
                  <p>{`- ${category}`}</p>
                ))}
              </p>
              <p>
                <b>Tags:</b>
                {wishProduct.tags.map((tag) => (
                  <p>{`- ${tag}`}</p>
                ))}
              </p>
              <p className="card-content-description">
                <b>Description: </b>
                {wishProduct.description}
              </p>
              <p>
                <b>Average Rating:</b>
              </p>
              <ReactStars
                count={5}
                value={wishProduct.averageRating}
                size={24}
                activeColor="#FF7F7F"
                edit={false}
                half={true}
                style={{ zIndex: 0 }}
              ></ReactStars>
              <br />
              <label>quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                max={wishProduct.availableQuantity}
                onInput={handleWishProductQuantity}
              ></input>
              <br></br>
              <button
                className="cart-button"
                onClick={() =>
                  addProductToCart({
                    id: wishProduct.id,
                    productName: wishProduct.name,
                    label: wishProduct.label,
                    sellerUsername: wishProduct.sellerUsername,
                    quantity: quantity,
                    unitPrice: wishProduct.unitPrice,
                    condition: wishProduct.condition,
                    availableQuantity: wishProduct.availableQuantity,
                  })
                }
              >
                Add to cart <BsCart4 />
              </button>
              <button
                className="remove-cart-btn"
                onClick={() =>
                  removeProductFromWishList({
                    id: wishProduct.id,
                    productName: wishProduct.name,
                    sellerUsername: wishProduct.sellerUsername,
                  })
                }
              >
                Remove Product <MdCancel />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default WishList;
