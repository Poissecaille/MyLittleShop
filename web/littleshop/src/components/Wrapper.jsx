import React from 'react'
import '../style/Wrapper.css'
import { Link } from "react-router-dom";

const Wrapper = () => {
    return (
        <div className='wrapper'>
            <div className='wrapper-title'>
            <Link to="/">MyLittleShop</Link>
            </div>
            <div className='wrapper-register'>
                <Link to="/register">Register</Link>
            </div>
            <div className='wrapper-login' >
                <Link to="/login">Login</Link>
            </div>
        </div>
    )
}

export default Wrapper