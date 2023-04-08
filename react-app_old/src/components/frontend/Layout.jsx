import { Outlet } from 'react-router-dom'
// import { AuthProvider } from '../../context/AuthContext'
import Footer from './Footer'
import Header from './Header'

const Layout = () => {
  
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout