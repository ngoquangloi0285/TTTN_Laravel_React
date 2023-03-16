import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Footer from './Footer'
import Header from './Header'

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