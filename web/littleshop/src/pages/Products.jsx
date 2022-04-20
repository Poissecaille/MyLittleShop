import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { BsSuitHeart, BsCart4 } from "react-icons/bs";
import "../style/Product.css";
import { capitalize } from "../utils/functions";
import Popup from "../components/Popup";
import ReactStars from "react-rating-stars-component";

const BACKEND_PRODUCTS_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/products`;
const BACKEND_CART_PRODUCTS_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/cartProduct`;
const BACKEND_CATEGORIES_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/productCategories`;
const BACKEND_TAGS_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/productTags`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [productName, setProductName] = useState("");
  const [productCondition, setProductCondition] = useState(null);
  //const [productSort, setProductSort] = useState("unitPrice");
  const [cartQuantity, setCartQuantity] = useState(0);
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

  const handleCartQuantity = (e) => {
    setCartQuantity(parseInt(e.target.value, 10));
  };
  const handleCondition = (e) => {
    setProductCondition(e.target.value);
  };
  // const handleSort = (e) => {
  //   setProductSort(e.target.value);
  //   window.location.reload();
  // };
  const handleMinPrice = (e) => {
    setTimeout(() => {
      setMinPrice(e.target.value);
    }, 300);
  };
  const handleMaxPrice = (e) => {
    setTimeout(() => {
      setMaxPrice(e.target.value);
    }, 300);
  };
  const handleProductName = (e) => {
    setTimeout(() => {
      if (e.target.value === "") {
        setProductName(e.target.value);
      } else {
        setProductName(capitalize(e.target.value));
      }
    }, 300);
  };

  useEffect(() => {
    axios
      .get(BACKEND_CATEGORIES_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCategories(response.data.response);
        // let tmp = [];
        // for (let i = 0; i < response.data.response.length; i++) {
        //   tmp.push(response.data.response[i].name);
        // }
        // setCategories(tmp);
        console.log(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(BACKEND_TAGS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setTags(response.data.response);
        // let tmp = [];
        // for (let i = 0; i < response.data.response.length; i++) {
        //   tmp.push(response.data.response[i].name);
        // }
        // setCategories(tmp);
        console.log(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BACKEND_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          lowerPrice: minPrice,
          higherPrice: maxPrice,
          productName: productName,
          condition: productCondition,
          category: category,
          tag: tag,
        },
      })
      .then((response) => {
        setProducts(response.data.response);
        console.log(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [maxPrice, minPrice, productName, productCondition, category, tag]);

  const addProductToCart = (data) => {
    console.log(data);
    axios
      .post(
        BACKEND_CART_PRODUCTS_URL,
        {
          productName: data.productName,
          quantity: data.quantity,
          sellerUsername: data.sellerUsername,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(async (response) => {
        if (response.status === 201) {
          if (localStorage.getItem("cartProduct") === null) {
            localStorage.setItem("cartProduct", "[]");
          }
          var oldCart = JSON.parse(localStorage.getItem("cartProduct"));
          console.log(oldCart);

          oldCart.push({
            id: data.id,
            productName: data.productName,
            label: data.label,
            quantity: data.quantity,
            sellerUsername: data.sellerUsername,
            unitPrice: data.unitPrice,
            condition: data.condition,
            availableQuantity: data.availableQuantity,
          });
          localStorage.setItem("cartProduct", JSON.stringify(oldCart));
          setPopupTitle("LittleShop product management information");
          setPopupContent(
            `${data.quantity} "${data.productName}" have been successfully added to cart !`
          );
          await popupHandler(popup);
          //window.location.reload()
        }
      })
      .catch(async (error) => {
        if (error.response.status === 409) {
          setPopupTitle("LittleShop product management information");
          setPopupContent(` "${data.productName}" is already inside cart !`);
          await popupHandler(popup);
        }
      });
  };
  return (
    <div>
      <Navbar />
      <div className="filters">
        <h3>filters</h3>
        <div className="gaug-price">
          <label>
            <b>min price: </b>
            {minPrice}$
          </label>
          <input
            type="range"
            onInput={handleMinPrice}
            id="minPrice"
            name="minPrice"
            min="0"
            max="1000"
          ></input>
          <label>
            <b>max price: </b>
            {maxPrice}$
          </label>
          <input
            type="range"
            onInput={handleMaxPrice}
            id="maxPrice"
            name="maxPrice"
            min="0"
            max="1000"
          ></input>
        </div>
        <div className="product-name">
          <label>
            <b>product name: </b>
          </label>
          <input
            type="text"
            onInput={handleProductName}
            id="productName"
            name="productName"
          ></input>
        </div>
        <div className="dropdown-condition">
          <label>
            <b>condition:</b>
          </label>
          <select
            name="conditions"
            id="conditions"
            onChange={handleCondition}
            value={productCondition}
          >
            <option value="all">all</option>
            <option value="new">new</option>
            <option value="occasion">occasion</option>
            <option value="renovated">renovated</option>
          </select>
        </div>
        <div className="dropdown-categories">
          <label>
            <b>category:</b>
          </label>
          <select
            name="categories"
            id="categories"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            value={category}
          >
            <option value="all">all</option>
            {categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-tags">
          <label>
            <b>tag:</b>
          </label>
          <select
            name="tags"
            id="tags"
            onChange={(e) => {
              setTag(e.target.value);
            }}
            value={tag}
          >
            <option value="all">all</option>
            {tags.map((tag) => (
              <option value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        {/* <div className="dropdown-sort">
          <label>
            <b>Sort by:</b>
          </label>
          <select
            name="sort"
            id="sort"
            onChange={handleSort}
            value={productSort}
          >
            <option value="unitPrice">unitPrice</option>
            <option value="condition">condition</option>
          </select>
        </div> */}
      </div>

      <div className="container">
        <Popup trigger={popup} title={popupTitle} value={popupContent} />
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img">
              <img
                src={require("../images/box.png")}
                alt="standard product"
                width="200"
                height="200"
              />
            </div>
            <div className="card-header">
              <h2>{product.name}</h2>
            </div>
            <div className="card-content">
              <p>
                <b>Seller: </b>
                {product.sellerUsername}
              </p>
              <p>
                <b>Label: </b>
                {product.label}
              </p>
              <p>
                <b>Price: </b>
                {product.unitPrice}
              </p>
              <p>
                <b>AvailableQuantity: </b>
                {product.availableQuantity}
              </p>
              <p>
                <b>Condition: </b>
                {product.condition}
              </p>
              <p className="card-content-description">
                <b>Description: </b>
                {product.description}
              </p>
              <p>
                <b>Average Rating:</b>
              </p>
              <ReactStars
                count={5}
                value={product.averageRating}
                size={24}
                activeColor="#FF7F7F"
                edit={false}
                half={true}
              ></ReactStars>
              <label>quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                max={product.availableQuantity}
                onInput={handleCartQuantity}
              ></input>
              <br></br>
              <button
                className="cart-button"
                onClick={() =>
                  addProductToCart({
                    id: product.id,
                    productName: product.name,
                    label: product.label,
                    sellerUsername: product.sellerUsername,
                    quantity: cartQuantity,
                    unitPrice: product.unitPrice,
                    condition: product.condition,
                    availableQuantity: product.availableQuantity,
                  })
                }
              >
                Add to cart <BsCart4 />
              </button>
              <button className="wish-button">
                Add to whishlist <BsSuitHeart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
