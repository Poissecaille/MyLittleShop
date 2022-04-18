import React, { useState } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import "../style/RatingForm.css";
import { BiEdit } from "react-icons/bi";

const BACKEND_RATING_URL = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/ratingProduct`;
console.log(BACKEND_RATING_URL)

const RatingForm = (props) => {
    var [ratingNote, setRatingNote] = useState("");
    const addRatingNote = () => {
        props.updateDisplay();
        axios
            .post(BACKEND_RATING_URL, {
                productId: props.productId,
                value: props.rating,
                comment: ratingNote !== "" ? ratingNote : null
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((response) => {
                    // if (response.status === 201) {
                    //     localStorage.
                    // }
                }).catch((error) => {
                    console.log(error)
                })
    }

    return props.trigger ? (
        <div className="form-container">
            <div className="form-inner">
                <div className="form-wrapper">
                    <h1>
                        Rating form
                    </h1>
                    <p>
                        Would you like to add a note about this product?
                    </p>
                    <p><b>
                        {props.productName}
                    </b>
                    </p>
                    <ReactStars
                        count={5}
                        value={props.rating}
                        size={24}
                        activeColor='#FF7F7F'
                        edit={false}>
                    </ReactStars>
                    <input
                        type="text"
                        onInput={(e) => setRatingNote(e.target.value)}
                    >
                    </input><br></br>
                    <button className="rating-note-btn" onClick={() => addRatingNote()}>
                        Add a note <BiEdit />
                    </button>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
};

export default RatingForm;