import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { BsListUl } from "react-icons/bs";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { GrCatalogOption } from "react-icons/gr"
import { BsSuitHeart, BsCart4, BsSignpost } from "react-icons/bs"
import { RiBillLine } from "react-icons/ri"
import { MdOutlineAccountCircle, MdOutlineAdminPanelSettings } from "react-icons/md"
import '../style/Sidemenu.css'
import { IconContext } from 'react-icons/lib';
import { useEffect } from 'react';
import axios from "axios";

//const token = localStorage.getItem("token");



const Sidemenu = () => {

    const BACKEND_USER_ROLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/userRole`;
    const [sidebar, setSidebar] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const showSidebar = () => setSidebar(!sidebar);
    const [role, setRole] = useState("buyer");
    const sidebarData = [
        {
            title: "Home",
            path: "/",
            icon: <AiOutlineHome />,
            className: 'nav-text'
        },
        {
            title: "Account",
            path: "/account",
            icon: <MdOutlineAccountCircle />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Addresses",
            path: "/addresses",
            icon: <BsSignpost />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Products",
            path: "/products",
            icon: <GrCatalogOption />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Cart",
            path: "/cart",
            icon: <BsCart4 />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Wishlist",
            path: "/wishlist",
            icon: <BsSuitHeart />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Orders",
            path: "/orders",
            icon: <RiBillLine />,
            className: token ? 'nav-text' : 'nav-text-hidden'
        },
        {
            title: "Admin",
            path: "/admin",
            icon: <MdOutlineAdminPanelSettings />,
            className: role === "admin" ? 'nav-text' : 'nav-text-hidden'
        },
    ]
    useEffect(() => {
        axios
            .get(BACKEND_USER_ROLE, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setRole(response.data.response);
            }).catch((error) => {

            })

    },[token]);



    return (
        <>
            <IconContext.Provider value={{ color: "black" }}>
                <Link to="#" className='menu-bars' style={{ textDecoration: 'none', color: "black" }} >
                    <BsListUl onClick={showSidebar} />
                </Link>
                <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <AiOutlineClose />
                            </Link>
                        </li>
                        {sidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.className}>
                                    <Link to={item.path} style={{ textDecoration: 'none', color: "black", backgroundColor: "transparent" }}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>)
}
export default Sidemenu