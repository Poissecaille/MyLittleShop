import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
import "../style/Admin.css";
const BACKEND_USER_ROLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/userRole`;
const BACKEND_ADMIN_CONSOLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/admin`;

const Admin = () => {
  //localStorage.removeItem("admin");
  var adminData = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : [];
  console.log(adminData);
  const [role, setRole] = useState("buyer");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  // const [data, setData] = useState("");
  const [popup, setShowPopUp] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const popupHandler = (e) => {
    return new Promise((resolve) => {
      setShowPopUp(!e);
      setTimeout(() => {
        setShowPopUp(false);
        resolve();
      }, 2000);
    });
  };

  useEffect(() => {
    axios
      .get(BACKEND_USER_ROLE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.response);
        setRole(response.data.response);
      });
  });

  useEffect(() => {
    if (role === "admin") {
      axios
        .get(BACKEND_ADMIN_CONSOLE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            limit: limit,
            offset: offset,
          },
        })
        .then((response) => {
          console.log(response.data.response);
          localStorage.setItem("admin", JSON.stringify(response.data.response));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [adminData]);

  return adminData.length > 0 ? (
    <>
      <Navbar />
      <h1 className="admin-title">ADMINISTRATION CONSOLE</h1>
      {adminData.map((userData) => (
        <div className="admin-users-card">
          <div className="admin-img">
            <img
              src={require("../images/star.png")}
              alt="standard profile"
              width={100}
              height={100}
            ></img>
          </div>
          <div className="cart-admin-header">
            <h3>USER</h3>
            <b>Email: </b>
            {userData.email}
            <br />
            <b>Username: </b>
            {userData.username}
            <br />
            <b>Role: </b>
            {userData.role}
            <br />
          </div>
          {userData.orders ? (
            <>
              <b>Orders</b>:{" "}
            </>
          ) : (
            <></>
          )}
          <table className="orders-table">
            <tr>
              {userData.orders &&
                userData.orders.map((order) =>
                  Object.keys(order).map((key, index) => <th>{key}</th>)
                )}
            </tr>
            <tr>
              {userData.orders &&
                userData.orders.map((order) =>
                  Object.keys(order).map((key, index) => <td>{order[key]}</td>)
                )}
            </tr>
          </table>
        </div>
      ))}
    </>
  ) : (
    <>DEBUG</>
  );
};
export default Admin;
