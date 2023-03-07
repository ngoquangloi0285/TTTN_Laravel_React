 import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
// import Header from '..frontend/Header'
 const Layout = () => {
   return (
     <>
        <Header/>
        <Outlet/>
        <Footer/>
     </>
   )
 }
 
 export default Layout