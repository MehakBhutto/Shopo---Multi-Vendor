import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Login from "../components/Login/Login.jsx";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((slate) => slate.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/")
    }
  }, [])

  return (
    <div className='w-full h-screen bg-gray-50'>
      <Login />
    </div>
  )
}

export default LoginPage
