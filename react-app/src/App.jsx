import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/frontend/Layout';
import Home from './pages/frontend/Home'
import OurStore from './pages/frontend/OurStore'
import About from './pages/frontend/About'
import Contact from './pages/frontend/Contact'
import Blog from './pages/frontend/Blog'
import CompareProduct from './pages/frontend/CompareProduct'
import NotFound from './pages/NotFound';
import Dashboard from './components/backend/Dashboard'
import Login from './pages/frontend/Login'
import Signup from './pages/frontend/SingUp'
import Product from './pages/backend/Product/Product'
import Wishlist from './pages/frontend/Wishlist'
import Forgotpassword from './pages/frontend/Forgotpassword'
import ResetPassword from './pages/frontend/ResetPassword'
import AuthLayout from './Layout/AuthLayout';
import GuestLayout from './Layout/GuestLayout';
import React from 'react';
import Header from './components/frontend/Header';
import Footer from './components/frontend/Footer';
import ChangePasswordForm from './pages/frontend/ChangePassword';
import Brand from './pages/backend/Brand';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='blog' element={<Blog />} />
        <Route path="store" element={<OurStore />} />
        <Route path="compare-product" element={<CompareProduct />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path='/' element={<AuthLayout />}>
          <Route path="admin" element={<Dashboard />} >
            <Route path="product" element={<Product />} />
            <Route path="brand" element={<Brand />} />
          </Route>
        </Route>
        <Route element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<Forgotpassword />} />
          <Route path="password-reset/:token" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
