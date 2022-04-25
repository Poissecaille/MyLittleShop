import React, { useState } from "react";
import "../style/Form.css";
import axios from "axios";
import { IoBan } from "react-icons/io5";

const AdminForm = (props) => {
  const [password, setPassword] = useState("");
  const DISABLE_USER_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/disable`;

  const closeForm = () => {
    props.updateDisplay();
  };

  const disableUser = () => {
    axios
      .put(
        DISABLE_USER_URL,
        {
          email: props.email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        window.location.reload();
        //TODO refresh localstorage
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return props.trigger ? (
    <div className="form-container">
      <div className="form-inner">
        <button
          onClick={() => {
            closeForm();
          }}
        >
          X
        </button>
        <div className="form-wrapper">
          <h1>ADMIN FORM</h1>
          <label>
            <b>PASSWORD:</b>
          </label>
          <input
            value={password}
            onInput={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="admin-form-btn" onClick={() => disableUser()}>
            Disable User <IoBan />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default AdminForm;
