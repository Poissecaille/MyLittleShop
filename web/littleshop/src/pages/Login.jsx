import React, { useState } from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar'
import { useNavigate } from "react-router-dom";

const BACKEND_LOGIN_URL = "http://localhost:5002/api/login"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState('');

  const loginBackEnd = async () => {
    try {
      const request = await axios.post(BACKEND_LOGIN_URL, {
        email: email,
        password: password
      });
      console.log(request)
      if (request.status === 200) {
        setLoginStatus(request.data.response);
        console.log(loginStatus)
        navigate("/");
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Navbar />
      <div className='Login'>
        <h1>Login</h1>
        <label>email</label>
        <input type="text"
          onChange={(e) => {
            setEmail(e.target.value)
          }}>
        </input>
        <label>password</label>
        <input type="text"
          onChange={(e) => {
            setPassword(e.target.value)
          }}>
        </input>
        <button onClick={loginBackEnd}> Login </button>
      </div>
    </div>
  )
}

export default Login