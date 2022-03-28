import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import {
  MdOutlineAddLocationAlt,
  MdOutlineWrongLocation,
  MdOutlineEditLocation,
} from "react-icons/md";
import Form from "../components/Form";
import "../style/Address.css";

const BACKEND_ADDRESSES_URL = "http://localhost:5000/userAddresses";
const BACKEND_ADDRESS_URL = "http://localhost:5000/userAddress";

const Addresses = () => {
  const [popup, setShowPopUp] = useState(false);
  const [form, setShowForm] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [modify, setModify] = useState(false);
  const [addressToUpdate, setaddressToUpdate] = useState("");
  const [mainAddressId, setMainAddressId] = useState(0);
  var addresses = localStorage.getItem("addresses")
    ? JSON.parse(localStorage.getItem("addresses"))
    : [];
  if (addresses.length === 0) {
    setPopupTitle("LittleShop Account management information");
    setPopupContent("No do not have any address yet please add one.");
    popupHandler().then(() => {});
  }

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
  };

  const removeAddress = (data) => {
    axios
      .delete(BACKEND_ADDRESS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          address1: data.address1,
          address2: data.address2,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          for (let i = 0; i < addresses.length; i++) {
            if (
              addresses[i].address1 === data.address1 &&
              addresses[i].address2 === data.address2
            ) {
              addresses.splice(i, 1);
              localStorage.setItem("addresses", JSON.stringify(addresses));
              break;
            }
          }
          window.location.reload();
        }
      });
  };

  const chooseMainAddress = (id) => {
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].id === id) {
        addresses[i].mainAddress = true;
      } else {
        addresses[i].mainAddress = false;
      }
    }
    localStorage.setItem("addresses", JSON.stringify(addresses));
    console.log(JSON.parse(localStorage.getItem("addresses")));
    setMainAddressId(id);
  };

  useEffect(() => {
    new Promise((resolve) => {
      if (addresses.length === 0) {
        axios
          .get(BACKEND_ADDRESSES_URL, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            addresses = response.data.response;
            localStorage.setItem("addresses", JSON.stringify(addresses));
            window.location.reload();

            resolve();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        resolve();
      }
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="address-page">
        <Form
          trigger={form}
          updateDisplay={() => setShowForm(false)}
          modify={modify}
          addressToUpdate={addressToUpdate}
        />
        <Popup trigger={popup} title={popupTitle} value={popupContent} />
        <h1>Your addresses</h1>
        {addresses.map((address) => (
          <div
            className={
              mainAddressId === address.id
                ? "main-address-card"
                : "address-card"
            }
            key={address.id}
            onClick={() => {
              chooseMainAddress(address.id);
            }}
          >
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
              <p>{address.city}</p>
              <p>{address.region}</p>
              <p>
                <b>{address.country}</b>
              </p>
              <p>{address.postalCode}</p>
              <button
                className="address-remove-btn"
                onClick={() => {
                  removeAddress(address);
                }}
              >
                Remove address <MdOutlineWrongLocation />
              </button>
              <button
                className="address-edit-btn"
                onClick={() => {
                  setaddressToUpdate(address);
                  setModify(true);
                  displayForm();
                }}
              >
                Modify address <MdOutlineEditLocation />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="address-add-btn"
        onClick={() => {
          displayForm();
        }}
      >
        Add an address <MdOutlineAddLocationAlt />
      </button>
    </div>
  );
};

export default Addresses;
