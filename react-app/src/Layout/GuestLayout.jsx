import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'

const GuestLayout = () => {
    const {currentUser} = useAuthContext();
  return !currentUser ? <Outlet/> : <Navigate to="/"/>
}

export default GuestLayout