import { Route, Routes } from 'react-router-dom';
import './App.css';
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
import Wishlist from './pages/frontend/Wishlist'
import Forgotpassword from './pages/frontend/Forgotpassword'
import ResetPassword from './pages/frontend/ResetPassword'
import AuthLayout from './Layout/AuthLayout';
import GuestLayout from './Layout/GuestLayout';
import ChangePasswordForm from './pages/frontend/ChangePassword';
import Shop from './components/frontend/Shop';
import MasterLayout from './components/backend/Layouts/MasterLayout';
import Category from './pages/backend/Category/Category'
import Product from './pages/backend/Product/Product'
import EditProduct from './pages/backend/Product/Edit';
import EditCategory from './pages/backend/Category/Edit';
import NewProduct from './pages/backend/Product/NewProduct';
import NewCategory from './pages/backend/Category/NewCategory';
import TrashProduct from './pages/backend/Product/Trash';
import TrashCategory from './pages/backend/Category/Trash';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Shop />}>
          <Route index element={<Home />} />

          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='blog' element={<Blog />} />
          <Route path="store" element={<OurStore />} />
          <Route path="compare-product" element={<CompareProduct />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="change-password" element={<ChangePasswordForm />} />

          <Route element={<GuestLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="password-reset/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route path='/' element={<AuthLayout />}>
          <Route path="admin" element={<MasterLayout />} >
            {/* Product */}
            <Route path="product" element={<Product />} />
            <Route path="product/create-product" element={<NewProduct />} />
            <Route path="product/edit-product/:id" element={<EditProduct />} />
            <Route path="product/trash-product" element={<TrashProduct />} />
            {/* Category */}
            <Route path="category" element={<Category />} />
            <Route path="category/create-category" element={<NewCategory />} />
            <Route path="category/edit-category/:id" element={<EditCategory />} />
            <Route path="category/trash-category" element={<TrashCategory />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
