import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const BACKEND_USER_ROLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/userRole`;
const BACKEND_ADMIN_CONSOLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/admin`;


const Admin = () => {
    const [role, setRole] = useState("buyer");
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
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
                        offset: offset
                    }
                })
                .then((response) => {
                    console.log(response.data.response);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    });

    return (
        <>
            <h1>ADMIN PAGE</h1>
        </>
    )
}
export default Admin;