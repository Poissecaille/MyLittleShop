import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const BACKEND_ORDER_URL = "http://localhost:5000/orderProducts";

const Order = () => {
    //localStorage.removeItem("orderProduct")
    var orders = localStorage.getItem("orderProduct")
        ? JSON.parse(localStorage.getItem("orderProduct"))
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
                                <th>Value</th>
                                <th>Expedition status</th>
                                <th>Expedition date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr className="order-raw" key={order.id}>
                                    <td>
                                        {`${order.address.address1} ${order.address.address2} ${order.address.address3} ${order.address.city} ${order.address.country} ${order.address.region} ${order.address.postalCode}`}
                                    </td>
                                    <td>
                                        {order.cart.productName}
                                    </td>
                                    <td>
                                        {order.cart.quantity}
                                    </td>
                                    <td>
                                        {order.cart.unitPrice * order.cart.quantity}
                                    </td>
                                    {/* <td>
                                        {shipped}
                                    </td>
                                    <td>
                                        {shippingDate}
                                    </td> */}
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