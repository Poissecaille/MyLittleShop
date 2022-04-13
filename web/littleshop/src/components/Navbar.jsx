import React from "react";
import "../style/Navbar.css";
import { Link } from "react-router-dom";
import Sidemenu from "./Sidemenu";

const Navbar = () => {
  const token = localStorage.getItem("token");
  console.log(token)
  return (
    <div className="navBar">
      <div className="wrapper">
        <div className="wrapper-menu">
          <Sidemenu />
        </div>
        <div className="wrapper-title">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            MyLittleShop
          </Link>
        </div>
        <div className="wrapper-register">
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "black" }}
          >
            Register
          </Link>
        </div>
        <div className="wrapper-logout">
          <Link to="/logout" style={{ textDecoration: "none", color: "black", display: token ? "block" : "none" }}>
            Logout
          </Link>
        </div>
        <div className="wrapper-login">
          <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
