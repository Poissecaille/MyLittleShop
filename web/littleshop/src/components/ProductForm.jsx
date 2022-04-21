import React, { useState } from "react";
import "../style/Form.css";
import axios from "axios";
import { MdOutlineAddLocationAlt, MdOutlineEditLocation } from "react-icons/md";

const BACKEND_PRODUCT_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/product`;

const ProductForm = (props) => {
  var [name, setName] = useState("");
  var [label, setLabel] = useState("");
  var [condition, setCondition] = useState("");
  var [description, setDescription] = useState("");
  var [unitPrice, setUnitPrice] = useState("");
  var [availableQuantity, setAvailableQuantity] = useState("");

  const addProduct = () => {
    props.updateDisplay();
    axios
      .post(
        BACKEND_PRODUCT_URL,
        {
          name: name,
          label: label,
          condition: condition,
          description: description,
          unitPrice: unitPrice,
          availableQuantity: availableQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editProduct = () => {
    props.updateDisplay();
    axios
      .put(
        BACKEND_PRODUCT_URL,
        {
          name: name ? name : props.productToUpdate.name,
          label: label ? label : props.productToUpdate.label,
          condition: condition ? condition : props.productToUpdate.condition,
          description: description
            ? description
            : props.productToUpdate.description,
          unitPrice: unitPrice ? unitPrice : props.productToUpdate.unitPrice,
          availableQuantity: availableQuantity
            ? availableQuantity
            : props.productToUpdate.availableQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeForm = () => {
    props.updateDisplay();
  };

  if (props.modify) {
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
            <h1>Product editor</h1>
            <label>
              <b>Recipient name:</b>
            </label>
            <input
              value={name}
              placeholder={props.productToUpdate.name}
              onInput={(e) => setName(e.target.value)}
            />
            <label>
              <b>label:</b>
            </label>
            <input
              value={label}
              placeholder={props.productToUpdate.label}
              onInput={(e) => setLabel(e.target.value)}
            />
            <label>
              <b>condition:</b>
            </label>
            <input
              value={condition}
              placeholder={props.productToUpdate.condition}
              onInput={(e) => setCondition(e.target.value)}
            />
            <label>
              <b>description:</b>
            </label>
            <input
              value={description}
              placeholder={props.productToUpdate.description}
              onInput={(e) => setDescription(e.target.value)}
            />
            <label>
              <b>unitPrice:</b>
            </label>
            <input
              value={unitPrice}
              placeholder={props.productToUpdate.unitPrice}
              onInput={(e) => setUnitPrice(e.target.value)}
            />
            <label>
              <b>availableQuantity:</b>
            </label>
            <input
              value={availableQuantity}
              placeholder={props.productToUpdate.availableQuantity}
              onInput={(e) => setAvailableQuantity(e.target.value)}
            />
            <br />
            <button className="product-form-btn" onClick={() => editProduct()}>
              Modify product <MdOutlineEditLocation />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <></>
    );
  }
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
          <h1>Product editor</h1>
          <label>
            <b>Recipient name:</b>
          </label>
          <input value={name} onInput={(e) => setName(e.target.value)} />
          <label>
            <b>label:</b>
          </label>
          <input value={label} onInput={(e) => setLabel(e.target.value)} />
          <label>
            <b>condition:</b>
          </label>
          <input
            value={condition}
            onInput={(e) => setCondition(e.target.value)}
          />
          <label>
            <b>description:</b>
          </label>
          <input
            value={description}
            onInput={(e) => setDescription(e.target.value)}
          />
          <label>
            <b>unitPrice:</b>
          </label>
          <input
            value={unitPrice}
            onInput={(e) => setUnitPrice(e.target.value)}
          />
          <label>
            <b>availableQuantity:</b>
          </label>
          <input
            value={availableQuantity}
            onInput={(e) => setAvailableQuantity(e.target.value)}
          />
          <br />
          <button className="product-form-btn" onClick={() => addProduct()}>
            Add product <MdOutlineEditLocation />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default ProductForm;
