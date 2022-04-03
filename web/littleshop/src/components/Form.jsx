import React, { useState } from "react";
import "../style/Form.css";
import { MdOutlineAddLocationAlt, MdOutlineEditLocation } from "react-icons/md";
import axios from "axios";

const BACKEND_ADDRESS_URL = `http://aggregator:${process.env.APP_AGGREGATOR_PORT}/userAddress`;

const Form = (props) => {
  var [address1, setAddress1] = useState("");
  var [address2, setAddress2] = useState("");
  var [address3, setAddress3] = useState("");
  var [city, setCity] = useState("");
  var [region, setRegion] = useState("");
  var [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState(0);
  var addresses = localStorage.getItem("addresses")
    ? JSON.parse(localStorage.getItem("addresses"))
    : [];

  const editAddress = () => {
    props.updateDisplay();
    axios
      .put(
        BACKEND_ADDRESS_URL,
        {
          address1: address1.toLowerCase().trim(),
          address2: address2.toLowerCase().trim(),
          address3: address3.toLowerCase().trim(),
          city: city.toLowerCase().trim(),
          region: region.toLowerCase().trim(),
          country: country.toLowerCase().trim(),
          postalCode: parseInt(postalCode, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < addresses.length; i++) {
            if (
              addresses[i].address1 === address1 &&
              addresses[i].address2 === address2
            )
              addresses.splice(i, 1);
            addresses.push(response.data.response);
            break;
          }

          localStorage.setItem("addresses", JSON.stringify(addresses));
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addAddress = () => {
    props.updateDisplay();

    axios
      .post(
        BACKEND_ADDRESS_URL,
        {
          address1: address1.toLowerCase().trim(),
          address2: address2.toLowerCase().trim(),
          address3: address3.toLowerCase().trim(),
          city: city.toLowerCase().trim(),
          region: region.toLowerCase().trim(),
          country: country.toLowerCase().trim(),
          postalCode: parseInt(postalCode, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          addresses.push({
            address1: address1.toLowerCase().trim(),
            address2: address2.toLowerCase().trim(),
            address3: address3.toLowerCase().trim(),
            city: city.toLowerCase().trim(),
            region: region.toLowerCase().trim(),
            country: country.toLowerCase().trim(),
            postalCode: postalCode,
          });
          localStorage.setItem("addresses", JSON.stringify(addresses));
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (props.modify) {
    return (
      <div className="form-container">
        <div className="form-inner">
          <div className="form-wrapper">
            <h1>Address editor</h1>
            <label>
              <b>Recipient name:</b>
            </label>
            <input
              value={address1}
              placeholder={props.addressToUpdate.address1}
              onInput={(e) => setAddress1(e.target.value)}
            />
            <label>
              <b>address:</b>
            </label>
            <input
              value={address2}
              placeholder={props.addressToUpdate.address2}
              onInput={(e) => setAddress2(e.target.value)}
            />
            <label>
              <b>additional address:</b>
            </label>
            <input
              value={address3}
              placeholder={props.addressToUpdate.address3}
              onInput={(e) => setAddress3(e.target.value)}
            />
            <label>
              <b>city:</b>
            </label>
            <input
              value={city}
              placeholder={props.addressToUpdate.city}
              onInput={(e) => setCity(e.target.value)}
            />
            <label>
              <b>region:</b>
            </label>
            <input
              value={region}
              placeholder={props.addressToUpdate.region}
              onInput={(e) => setRegion(e.target.value)}
            />
            <label>
              <b>country:</b>
            </label>
            <input
              value={country}
              placeholder={props.addressToUpdate.country}
              onInput={(e) => setCountry(e.target.value)}
            />
            <label>
              <b>postalCode:</b>
            </label>
            <input
              value={postalCode}
              placeholder={props.addressToUpdate.postalCode}
              onInput={(e) => setPostalCode(e.target.value)}
            />
            <br />
            <button className="address-form-btn" onClick={() => editAddress()}>
              Modify address <MdOutlineEditLocation />
            </button>
          </div>
        </div>
      </div>
    );
  }
  return props.trigger ? (
    <div className="form-container">
      <div className="form-inner">
        <div className="form-wrapper">
          <h1>Address form</h1>
          <label>
            <b>Recipient name:</b>
          </label>
          <input
            value={address1}
            onInput={(e) => setAddress1(e.target.value)}
          />
          <label>
            <b>address:</b>
          </label>
          <input
            value={address2}
            onInput={(e) => setAddress2(e.target.value)}
          />
          <label>
            <b>additional address:</b>
          </label>
          <input
            value={address3}
            onInput={(e) => setAddress3(e.target.value)}
          />
          <label>
            <b>city:</b>
          </label>
          <input value={city} onInput={(e) => setCity(e.target.value)} />
          <label>
            <b>region:</b>
          </label>
          <input value={region} onInput={(e) => setRegion(e.target.value)} />
          <label>
            <b>country:</b>
          </label>
          <input value={country} onInput={(e) => setCountry(e.target.value)} />
          <label>
            <b>postalCode:</b>
          </label>
          <input
            value={postalCode}
            onInput={(e) => setPostalCode(e.target.value)}
          />
          <br />
          <button className="address-form-btn" onClick={() => addAddress()}>
            Add address <MdOutlineAddLocationAlt />
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Form;
