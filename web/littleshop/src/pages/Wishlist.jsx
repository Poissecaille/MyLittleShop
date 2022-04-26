import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
//localStorage.removeItem("wishProduct")

const WishList = () => {
    const BACKEND_WISHLIST_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/wishProducts`;
    var wishs = localStorage.getItem("wishProduct")
        ? JSON.parse(localStorage.getItem("wishProduct"))
        : [];
    console.log(wishs)

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

    useEffect(() => {
        if (!wishs || wishs.length === 0) {
            axios
                .get(BACKEND_WISHLIST_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                .then((response) => {
                    wishs = response.data.response;
                    localStorage.setItem("wishProduct", JSON.stringify(wishs))
                    console.log(wishs)
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
                    }
                });
        }
    })
    return (
        <div>
            <Navbar />
            <div className="container">
                <Popup trigger={popup} title={popupTitle} value={popupContent} />
                {wishs.map((wishProduct) => (
                    <div className="wishProduct-card" key={wishProduct.id}>
                        <div className="wishProduct-img">
                            <img
                                src={require("../images/box.png")}
                                alt="standard wishProduct"
                                width="200"
                                height="200"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default WishList;
