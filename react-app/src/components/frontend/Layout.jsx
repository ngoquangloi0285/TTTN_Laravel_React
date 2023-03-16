import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthContext, { AuthProvider } from '../../context/AuthContext'
import Footer from './Footer'
import Header from './Header'
// import Header from '..frontend/Header'
const Layout = () => {
  
  return (
    <>
      <AuthProvider>
        <Header />
        <Outlet />
        <Footer />
      </AuthProvider>
    </>
  )
}

export default Layout