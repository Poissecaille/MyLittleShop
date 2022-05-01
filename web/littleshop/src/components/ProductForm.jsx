import React, { useState } from "react";
import "../style/Form.css";
import axios from "axios";
import { MdOutlineAddLocationAlt, MdOutlineEditLocation } from "react-icons/md";
import { useEffect } from "react";

const BACKEND_PRODUCT_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/product`;

const ProductForm = (props) => {
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setCategories(props.productToUpdate.categories)
    setTags(props.productToUpdate.tags)
  })

  const handleMultipleTags = (tag) => {
    console.log(props.productToUpdate.tags, tags)
    var buffer = tags;
    if (buffer.indexOf(tag) === -1) {
      buffer.push(tag)
      setTags(buffer)
    }
    else {
      buffer.splice(buffer.indexOf(tag), 1)
    }
    console.log(tags)
  }
  const handleMultipleCategories = (category) => {
    console.log(props.productToUpdate.categories, categories)
    var buffer = categories;
    if (buffer.indexOf(category) === -1) {
      buffer.push(category)
      setCategories(buffer)
    }
    else {
      buffer.splice(buffer.indexOf(category), 1)
    }
    console.log("buffer:", buffer)
    console.log("categories:", categories)
  }
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
          categories: categories ? categories : null,
          tags: tags ? tags : tags
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
          categories: categories ? categories : props.productToUpdate.categories,
          tags: tags ? tags : props.productToUpdate.tags
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.response)
        window.location.reload();
      })
      .catch((error) => {
        window.location.reload();
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

            <div className="categories">
              <label>
                <b>Categories</b>
              </label>
              <select multiple={true}>
                {props.categories.map((category) => (
                  <option value={category} onClick={() => handleMultipleCategories(category)}>{category}</option>
                ))}
              </select>
            </div>
            <div className="tags">
              <label>
                <b>Tags</b>
              </label>
              <select multiple={true}>
                {props.tags.map((tag) => (
                  <option value={tag} onClick={() => handleMultipleTags(tag)}>{tag}</option>
                ))}
              </select>
            </div>
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
          <div className="categories">
            <label>
              <b>Categories</b>
            </label>
            <select multiple={true}>
              {props.categories.map((category) => (
                <option value={category} onClick={() => handleMultipleCategories(category)}>{category}</option>
              ))}
            </select>
          </div>
          <div className="tags">
            <label>
              <b>Tags</b>
            </label>
            <select multiple={true}>
              {props.tags.map((tag) => (
                <option value={tag} onClick={() => handleMultipleTags(tag)}>{tag}</option>
              ))}
            </select>
          </div>
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
