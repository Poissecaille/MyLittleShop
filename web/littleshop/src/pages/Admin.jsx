import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { IoBan } from 'react-icons/io5'
import AdminForm from '../components/AdminForm'
import Popup from '../components/Popup'
import { useNavigate } from 'react-router-dom'
import '../style/Admin.css'
const BACKEND_USER_ROLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/userRole`
const BACKEND_ADMIN_CONSOLE = `http://localhost:${process.env.REACT_APP_AGGREGATOR_PORT}/admin`

const Admin = () => {
  //localStorage.removeItem("admin");
  var adminData = localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin'))
    : []
  console.log(adminData)
  const [role, setRole] = useState('buyer')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  // const [data, setData] = useState("");
  const [form, setShowForm] = useState(false)
  const [popup, setShowPopUp] = useState(false)
  const [popupContent, setPopupContent] = useState('')
  const [popupTitle, setPopupTitle] = useState('')
  const popupHandler = (e) => {
    return new Promise((resolve) => {
      setShowPopUp(!e)
      setTimeout(() => {
        setShowPopUp(false)
        resolve()
      }, 2000)
    })
  }

  const displayForm = (e) => {
    setShowForm(!e)
  }

  useEffect(() => {
    axios
      .get(BACKEND_USER_ROLE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setRole(response.data.response)
        console.log('ROLE', response.data.response, role)
      })
  }, [role])

  useEffect(() => {
    //if (!role || role.length === 0) {//
    if (role === 'admin') {
      axios
        .get(BACKEND_ADMIN_CONSOLE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            limit: limit,
            offset: offset,
          },
        })
        .then((response) => {
          // setRole(response.data.response)
          localStorage.setItem('admin', JSON.stringify(response.data.response))
          //window.location.reload()
        })
        .catch((error) => {
          console.log(error)
        })
    }
    //}
  }, [adminData])

  return (
    <>
      <Navbar />
      <h1 className="admin-title">ADMINISTRATION CONSOLE</h1>
      {adminData.map((userData) => (
        <div className="admin-users-card">
          <AdminForm
            trigger={form}
            email={userData.email}
            updateDisplay={() => {
              displayForm(form)
              console.log(form)
            }}
          ></AdminForm>
          <div className="admin-img">
            <img
              src={require('../images/star.png')}
              alt="standard profile"
              width={100}
              height={100}
            ></img>
          </div>
          <div className="cart-admin-header">
            <h3>USER</h3>
            <b>Email: </b>
            {userData.email}
            <br />
            <b>Username: </b>
            {userData.username}
            <br />
            <b>Role: </b>
            {userData.role}
            <br />
            <button className="deactivate-user" onClick={() => displayForm()}>
              Disable User <IoBan />
            </button>
          </div>

          {userData.orders && userData.orders.length > 0 ? (
            <>
              <h4>Orders:</h4>
            </>
          ) : (
            <></>
          )}
          <table className="orders-table">
            {userData.orders &&
              userData.orders.map((order) =>
                Object.keys(order).map((key, index) => (
                  <tr>
                    <th>{key}</th> <td>{order[key]}</td>
                  </tr>
                )),
              )}
          </table>

          {userData.addresses && userData.addresses.length > 0 ? (
            <>
              <h4>Addresses:</h4>
            </>
          ) : (
            <></>
          )}

          <table className="addresses-table">
            {userData.addresses &&
              userData.addresses.map((address) =>
                Object.keys(address).map((key, index) => (
                  <tr>
                    <th>{key}</th> <td>{address[key]}</td>
                  </tr>
                )),
              )}
          </table>

          {userData.products && userData.products.length > 0 ? (
            <>
              <h4>Products:</h4>
            </>
          ) : (
            <></>
          )}
          <table className="products-table">
            {userData.products &&
              userData.products.map((product) =>
                Object.keys(product).map((key, index) => (
                  <tr>
                    <th>{key}</th> <td>{product[key]}</td>
                  </tr>
                )),
              )}
          </table>
        </div>
      ))}
    </>
  )
}
export default Admin
