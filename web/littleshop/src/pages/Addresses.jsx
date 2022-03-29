import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import { MdOutlineAddLocationAlt, MdOutlineWrongLocation, MdOutlineEditLocation } from "react-icons/md";
import Form from "../components/Form";

const BACKEND_ADDRESSES_URL = "http://localhost:5000/userAddresses";

const Addresses = () => {
    const [popup, setShowPopUp] = useState(false);
    const [form, setShowForm] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    var addresses = localStorage.getItem("addresses") ? JSON.parse(localStorage.getItem("addresses")) : [];
    //localStorage.removeItem("addresses")
    const popupHandler = (e) => {
        return new Promise((resolve, reject) => {
            setShowPopUp(!e);
            setTimeout(() => {
                setShowPopUp(false);
                resolve();
            }, 2000);
        });
    };

    const displayForm = (e) => {
        setShowForm(!e);
    }

    useEffect(() => {
        new Promise((resolve) => {
            if (!localStorage.getItem("addresses")) {
                axios
                    .get(BACKEND_ADDRESSES_URL, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    })
                    .then((response) => {
                        addresses = response.data.response
                        resolve()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                resolve()
            }

        })
    }, [form])

    return (
        <div>
            <Navbar />
            <div className="address-page">
                <Form trigger={form} updateDisplay={() => setShowForm(false)} />
                <Popup trigger={popup} title={popupTitle} value={popupContent} />
                <h1>
                    Your addresses
                </h1>
                {addresses.map((address) => (
                    <div className="address-card" key={address.id}>
                        <div className="address-img">
                            <img
                                src={require("../images/location.png")}
                                alt="standard address"
                                width="200"
                                height="200"
                            />
                        </div>
                        <div className="card-address-content">
                            <p>
                                {address.address1} {address.address2} {address.address3}
                            </p>
                            <p>
                                {address.city}
                            </p>
                            <p>
                                {address.region}
                            </p>
                            <p>
                                <b>
                                    {address.country}
                                </b>
                            </p>
                            <p>
                                {address.postalCode}
                            </p>
                            <button className="address-remove-btn">
                                Remove address <MdOutlineWrongLocation />
                            </button>
                            <button className="address-edit-btn">
                                Modify address <MdOutlineEditLocation />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="address-add-btn"
                onClick={() => {
                    displayForm()
                }}>
                Add an address <MdOutlineAddLocationAlt />
            </button>
        </div>
    )
};

export default Addresses;