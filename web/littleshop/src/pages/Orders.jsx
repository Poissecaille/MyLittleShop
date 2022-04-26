import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import RatingForm from "../components/RatingForm";
//localStorage.removeItem("orderProduct")
//localStorage.removeItem("ratings")
const Order = () => {
  //const BACKEND_ORDER_URL = "http://localhost:5000/orderProducts";
  const SYNC_BACKEND_ORDER_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/syncOrder`;
  const BACKEND_USER_ROLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/userRole`;
  const USER_RATINGS = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/ratingsProductsPerUser`;

  const initOrders = localStorage.getItem("orderProduct")
    ? JSON.parse(localStorage.getItem("orderProduct"))
    : [];
  const initRatings = localStorage.getItem("ratings")
    ? JSON.parse(localStorage.getItem("ratings"))
    : [];

  //const [orders, setOrders] = useState(initOrders);
  var ratings = localStorage.getItem("ratings")
    ? JSON.parse(localStorage.getItem("ratings"))
    : [];
  var orders = localStorage.getItem("orderProduct")
    ? JSON.parse(localStorage.getItem("orderProduct"))
    : [];
  console.log(JSON.parse(localStorage.getItem("orderProduct")))
  // const [ratings, setRatings] = useState(initRatings);
  const [popup, setShowPopUp] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [form, setShowForm] = useState(false);
  const [role, setRole] = useState("buyer");
  const navigate = useNavigate();
  var [billing, setBilling] = useState(0);

  const displayForm = (e) => {
    setShowForm(!e);
  };

  const popupHandler = (e) => {
    return new Promise((resolve) => {
      setShowPopUp(!e);
      setTimeout(() => {
        setShowPopUp(false);
        resolve();
      }, 2000);
    });
  };

  const ratingChanged = (newRating) => {
    setRatingValue(newRating);
    console.log(ratingValue);
  };

  useEffect(() => {
    axios
      .get(BACKEND_USER_ROLE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRole(response.data.response);
      });
  });

  useEffect(() => {
    if (role === "buyer") {
      axios
        .get(USER_RATINGS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          localStorage.setItem(
            "ratings",
            JSON.stringify(response.data.response)
          );
          console.log("$$$$$$$$$$$$")
          ratings = response.data.response
          console.log(ratings);
          //setRatings(response.data.response)
          let buffer = orders;
          console.log(buffer)
          for (let i = 0; i < ratings.length; i++) {
            for (let j = 0; j < buffer.length; j++) {
              for (let k = 0; k < buffer[j].cart.length; k++) {
                console.log("***", buffer[j].cart[k].productId, ratings[i].productId)
                if (buffer[j].cart[k].productId === ratings[i].productId) {
                  console.log("RATE")
                  buffer[j].cart[k].userRate = ratings[i].value;
                }
              }
            }
          }
          //setOrders(buffer);
          orders = buffer
        });
    }
  }, []);

  useEffect(() => {
    //localStorage.removeItem("orderProduct")
    if (!orders || orders.length === 0) {
      console.log("SYNCHRONISATION")

      axios
        .get(SYNC_BACKEND_ORDER_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("€€€€")
          console.log(response.data.response)
          let buffer = response.data.response;
          for (let i = 0; i < ratings.length; i++) {
            for (let j = 0; j < buffer.length; j++) {
              for (let k = 0; k < buffer[j].cart.length; k++) {
                if (buffer[j].cart[k].productId === ratings[i].productId) {
                  buffer[j].cart[k].userRate = ratings[i].value;
                }
              }
            }
          }
          //setOrders(buffer);
          orders = buffer
          localStorage.setItem("orderProduct", JSON.stringify(orders))
          if (buffer.length === 0 && role === "buyer") {
            setPopupTitle("LittleShop Order management information");
            setPopupContent("You haven't placed any order yet!");
            popupHandler().then(() => {
              navigate("/products");
            });
          }
          localStorage.setItem(
            "orderProduct",
            JSON.stringify(response.data.response)
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            localStorage.removeItem("token");
            setPopupTitle("LittleShop account management information");
            setPopupContent("You are currently not logged in !");
            popupHandler().then(() => {
              navigate("/login");
            });
          }
        });
    }
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].cart.length; j++) {
        billing += orders[i].cart[j].unitPrice * orders[i].cart[j].quantity;
      }
    }
    setBilling(billing);
  }, []);

  return role === "buyer" ? (
    <div>
      <Navbar />
      <div className="order-container">
        <div className="order-wrapper">
          <Popup trigger={popup} title={popupTitle} value={popupContent} />
          <table>
            <thead>
              <tr>
                <th>Delivery Address</th>
                <th>ProductName</th>
                <th>Quantity</th>
                <th>Bill</th>
                <th>Expedition status</th>
                <th>Expedition date</th>
                <th>Order creation date</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.cart.map((cartProduct) => (
                  <tr className="order-raw" key={order.id}>
                    <RatingForm
                      productName={cartProduct.productName}
                      productId={cartProduct.id}
                      trigger={form}
                      rating={ratingValue}
                      updateDisplay={() => {
                        setShowForm(false);
                      }}
                    ></RatingForm>
                    <td>
                      {`${order.address.address1} ${order.address.address2} ${order.address.address3} ${order.address.city} ${order.address.country} ${order.address.region} ${order.address.postalCode}`}
                    </td>
                    <td>{cartProduct.productName}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>{cartProduct.unitPrice * cartProduct.quantity}</td>
                    <td>{cartProduct.shipped}</td>
                    <td>{cartProduct.shippingDate}</td>
                    <td>{cartProduct.created_at}</td>
                    <td>
                      {cartProduct.shipped === "preparation" &&
                        !cartProduct.userRate ? (
                        <ReactStars
                          activeColor={"#FF7F7F"}
                          size={16}
                          onChange={(e) => {
                            ratingChanged(e);
                            displayForm();
                          }}
                          style={{ zIndex: 0 }}
                        ></ReactStars>
                      ) : (
                        <ReactStars
                          activeColor={"#FF7F7F"}
                          size={16}
                          style={{ zIndex: 0 }}
                          value={cartProduct.userRate}
                          edit={false}
                        ></ReactStars>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <h4>
          total billing:
          <b> {billing}€</b>
        </h4>
      </div>
    </div>
  ) : (
    <div>
      <Navbar />
      <div className="order-container">
        <div className="order-wrapper">
          <Popup trigger={popup} title={popupTitle} value={popupContent} />
          <table>
            <thead>
              <tr>
                <th>Delivery Address</th>
                <th>ProductName</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Expedition status</th>
                <th>Expedition date</th>
                <th>Order creation date</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.cart.map((cartProduct) => (
                  <tr className="order-raw" key={order.id}>
                    <RatingForm
                      productName={cartProduct.productName}
                      productId={cartProduct.id}
                      trigger={form}
                      rating={ratingValue}
                      updateDisplay={() => {
                        setShowForm(false);
                      }}
                    ></RatingForm>
                    <td>
                      {`${order.address.address1} ${order.address.address2} ${order.address.address3} ${order.address.city} ${order.address.country} ${order.address.region} ${order.address.postalCode}`}
                    </td>
                    <td>{cartProduct.productName}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>{cartProduct.unitPrice * cartProduct.quantity}</td>
                    <td>{cartProduct.shipped}</td>
                    <td>{cartProduct.shippingDate}</td>
                    <td>{cartProduct.created_at}</td>
                    <td>
                      <td>
                        <ReactStars
                          activeColor={"#FF7F7F"}
                          size={16}
                          value={cartProduct.averageRating}
                          edit={false}
                          style={{ zIndex: 0 }}
                        ></ReactStars>
                      </td>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <h4>
          total billing:
          <b> {billing}€</b>
        </h4>
      </div>
    </div>
  );
};
export default Order;
