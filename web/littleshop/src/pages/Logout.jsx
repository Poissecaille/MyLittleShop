import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

const Logout = () => {
    const token = localStorage.getItem("token");
    const [popup, setShowPopUp] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const navigate = useNavigate();
    const popupHandler = (e) => {
        return new Promise((resolve, reject) => {
            setShowPopUp(!e);
            setTimeout(() => {
                setShowPopUp(false);
                resolve()
            }, 2000);
        })
    };
    useEffect(async () => {
        if (!token) {
            setPopupTitle("LittleShop account management information");
            setPopupContent("You are not logged in !");
            await popupHandler();
            navigate("/");
        }
        else {
            setPopupTitle("LittleShop account management information");
            setPopupContent("You have successfully logged out !");
            await popupHandler();
            //localStorage.removeItem("token");
            localStorage.clear();
            navigate("/");
            window.location.reload();
        }
    }, [])
    return (
        <div>
            <Navbar />
            <Popup trigger={popup} title={popupTitle} value={popupContent} />
        </div>
    );
};
export default Logout;