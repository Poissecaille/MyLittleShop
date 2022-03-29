import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import Popup from "../components/Popup";

const BACKEND_LOGIN_URL = "http://localhost:5000/login";
const Login = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setShowPopUp] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const popupHandler = (e) => {
    return new Promise((resolve, reject) => {
      setShowPopUp(!e);
      setTimeout(() => {
        setShowPopUp(false);
        resolve()
      }, 2000);
    })
  };

  const loginBackEnd = async () => {
    try {
      if (!token) {
        const request = await axios.post(BACKEND_LOGIN_URL, {
          email: email,
          password: password,
        });
        console.log(request.status);
        if (request.status === 200) {
          localStorage.setItem("token", request.data.token);
          //localStorage.setItem("tokenExpirate", request.data.expire);
          setPopupTitle("LittleShop account management information");
          setPopupContent("You have successfully logged in  !");
          await popupHandler();
          navigate("/");
        }
      } else {
        setPopupTitle("LittleShop account management information");
        setPopupContent("You are already logged in !");
        await popupHandler();
        navigate("/");
      }
    }
    catch (error) {
      console.log(error);
    };
  }
  return (
    <div>
      <Navbar />
      <Popup trigger={popup} title={popupTitle} value={popupContent} />
      <div className="Login">
        <h1 className="title-form">Login</h1>
        <label>email</label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value.toLowerCase());
          }}
        ></input>
        <label>password</label>
        <input
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input><br />
        <button className="login-button" onClick={loginBackEnd}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
