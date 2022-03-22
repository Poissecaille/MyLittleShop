import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Account.css"
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const BACKEND_DELETE_ACCOUNT_URL = "http://localhost:5000/deactivate";

const Account = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    console.log(token)
    const account = JSON.parse(localStorage.getItem("account"));
    console.log(account)
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
    const deleteAccount = async () => {
        try {
            const request = await axios.put(
                BACKEND_DELETE_ACCOUNT_URL, {
                password: account.password
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            console.log(request.status);
            if (request.status === 200) {
                setPopupTitle("LittleShop account management information");
                setPopupContent(`Your account has been successfully deleted ${account.username} !`);
                await popupHandler();
                navigate("/");
                localStorage.clear();
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <Navbar />
            <div className="account-img">
                <img
                    src={require("../images/star.png")}
                    alt="standard profile"
                    width="350"
                    height="350"
                />
            </div>
            <h2>PROFILE</h2>
            <div className="account-details">
                <Popup trigger={popup} title={popupTitle} value={popupContent} />
                <p>
                    <b>
                        Email:
                    </b> {account.email}
                </p>
                <p>
                    <b>
                        Username:
                    </b> {account.username}
                </p>
                <p>
                    <b>
                        Firstname:
                    </b> {account.firstName}
                </p>
                <p>
                    <b>
                        Lastname:
                    </b> {account.lastName}
                </p>
                <p>
                    <b>
                        Password:
                    </b> {account.password}
                </p>
                <p>
                    <b>
                        Birthdate:
                    </b> {account.birthDate.split("T")[0]}
                </p>
                <button className="delete-account"
                    onClick={deleteAccount}>Delete Account</button>
            </div>
        </div>
    )
}
export default Account;