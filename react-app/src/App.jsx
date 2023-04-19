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

// Backend
import MasterLayout from './components/backend/Layouts/MasterLayout';
// Route Brand
import Brand from './pages/backend/Brand/Brand'
import NewBrand from './pages/backend/Brand/NewBrand'
import EditBrand from './pages/backend/Brand/Edit'
import TrashBrand from './pages/backend/Brand/Trash'
// Route Product
import Product from './pages/backend/Product/Product'
import EditProduct from './pages/backend/Product/Edit';
import NewProduct from './pages/backend/Product/NewProduct';
import TrashProduct from './pages/backend/Product/Trash';
// Route Category
import Category from './pages/backend/Category/Category'
import EditCategory from './pages/backend/Category/Edit';
import NewCategory from './pages/backend/Category/NewCategory';
import TrashCategory from './pages/backend/Category/Trash';
// Route News
import News from './pages/backend/News/News'
import EditNews from './pages/backend/News/Edit';
import CreateNews from './pages/backend/News/CreateNews';
import TrashNews from './pages/backend/News/Trash';

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
            {/* Brand */}
            <Route path="brand" element={<Brand />} />
            <Route path="brand/create-brand" element={<NewBrand />} />
            <Route path="brand/edit-brand/:id" element={<EditBrand />} />
            <Route path="brand/trash-brand" element={<TrashBrand />} />
            {/* News */}
            <Route path="news" element={<News />} />
            <Route path="news/create-news" element={<CreateNews />} />
            <Route path="news/edit-news/:id" element={<EditNews />} />
            <Route path="news/trash-news" element={<TrashNews />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
