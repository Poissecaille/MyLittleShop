import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const BACKEND_ORDER_URL = "http://localhost:5000/orderProducts";

const Order = () => {
    var orders = localStorage.getItem("orders")
        ? JSON.parse(localStorage.getItem("orders"))
        : [];
    const [popup, setShowPopUp] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const navigate = useNavigate();

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
        console.log(orders)
        if (!orders || orders.length === 0) {
            axios
                .get(BACKEND_ORDER_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                .then((response) => {
                    orders = response.data.response;
                    console.log(orders)
                    if (orders.length === 0) {
                        setPopupTitle("LittleShop Order management information");
                        setPopupContent(
                            `You haven't placed any orders yet ${JSON.parse(localStorage["account"]).username
                            } !`
                        );
                        popupHandler().then(() => {
                            navigate("/products");
                        });
                    }
                })
                .catch((error) => {
                    console.log(error)
                    if (error.response.status === 403) {
                        localStorage.removeItem("token")
                        setPopupTitle("LittleShop account management information");
                        setPopupContent("You are currently not logged in !");
                        popupHandler().then(() => {
                            navigate("/login");
                        });
                    }
                })
        }
    }, []);

    return (
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
                                <th>Expedition status</th>
                                <th>Expedition date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr className="order-raw" key={order.id}>
                                    <td>
                                        {order.deliveryAddress}
                                    </td>
                                    <td>
                                        {order.ProductName}
                                    </td>
                                    <td>
                                        {order.quantity}
                                    </td>
                                    <td>
                                        {order.shipped}
                                    </td>
                                    <td>
                                        {order.shippingDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

};
export default Order;