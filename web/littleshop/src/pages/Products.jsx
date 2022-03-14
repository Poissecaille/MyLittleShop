import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_PRODUCTS_URL = "http://localhost:5000/products"

const Products = async () => {
    try {
        const request = await axios.get(BACKEND_PRODUCTS_URL, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(request.status)
    } catch (error) {
        console.log(error)
    }
}