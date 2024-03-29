import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/frontend/Home'
import OurStore from './pages/frontend/OurStore'
import Contact from './pages/frontend/Contact'
import Blog from './pages/frontend/Blog'
import NotFound from './pages/NotFound';
import Dashboard from './components/backend/Dashboard'
import Login from './pages/frontend/Login'
import Signup from './pages/frontend/SingUp'
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
// Route User
import User from './pages/backend/User/User'
import EditUser from './pages/backend/User/Edit';
import CreateUser from './pages/backend/User/CreateUser';
import TrashUser from './pages/backend/User/Trash';
// Route User
import Order from './pages/backend/Order/Order'
import UpdateOrder from './pages/backend/Order/Edit';
import TrashOrder from './pages/backend/Order/Trash';
// Route Menu
import Menu from './pages/backend/Menu/Menu'
import CreateMenu from './pages/backend/Menu/CreateMenu';
import TrashMenu from './pages/backend/Menu/Trash';
// Route Contact
import ContactAdmin from './pages/backend/Contact/Contact'
import CreateContact from './pages/backend/Contact/CreateContact';
import TrashContact from './pages/backend/Contact/Trash';
// Slide 
import Slide from './pages/backend/Slide/Slide'
import Cart  from './pages/frontend/Cart';
import { SearchProduct } from './components/frontend/Search';
import SlugProduct from './pages/frontend/SlugProduct';
import ProfilePage from './pages/frontend/ProfilePage';
import ProductDetailPage from './pages/frontend/ProductDetailPage';
import BlogSlugPage from './pages/frontend/BlogSlugPage';
import CartCheckOut from './pages/frontend/CartCheckOut';
import OrderTracking from './pages/frontend/OrderTracking';
import YourOrder from './pages/frontend/YourOrder';
import OrderHistory from './pages/frontend/OrderHistory';
import RevenueWeb from './pages/backend/Revenue/RevenueWeb';
import ViewHistory from './pages/backend/Order/ViewHistory';

function App(props) {

  return (
    <>
      <Routes>
        <Route path='/' element={<Shop />}>
          <Route index element={<Home />} />

          <Route path='contact' element={<Contact />} />
          <Route path='blog' element={<Blog />} />
          <Route path='blog/:slug' element={<BlogSlugPage />} />
          <Route path='blog/category/:slug' element={<Blog />} />
          <Route path='blog/other-news/:slug' element={<Blog />} />
          <Route path="store" element={<OurStore />} />
          <Route path="change-password" element={<ChangePasswordForm />} />
          <Route path="cart" element={<Cart />} />
          <Route path="cart/checkout" element={<CartCheckOut />} />
          {/* <Route path='category/:slug' element={<SlugProduct />} /> */}
          <Route path='category/:slug' element={<OurStore />} />
          {/* <Route path='brand-product/:slug' element={<SlugProduct />} /> */}
          <Route path='brand/:slug' element={<OurStore />} />
          <Route path="search/:keyword" element={<OurStore />} />
          <Route path="product/color/:slug" element={<OurStore />} />
          <Route path="product/inch/:slug" element={<OurStore />} />
          <Route path="product-detail/:slug" element={<ProductDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="your_order" element={<YourOrder />} />
          <Route path="order_tracking" element={<OrderTracking />} />
          <Route path="order_history" element={<OrderHistory />} />

          <Route element={<GuestLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="password-reset/:token" element={<ResetPassword />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
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
            {/* User */}
            <Route path="user" element={<User />} />
            <Route path="user/create-user" element={<CreateUser />} />
            <Route path="user/edit-user/:id" element={<EditUser />} />
            <Route path="user/trash-user" element={<TrashUser />} />
            {/* Order */}
            <Route path="order" element={<Order />} />
            <Route path="order/view-update/:id" element={<UpdateOrder />} />
            <Route path="order/history-order" element={<TrashOrder />} />
            <Route path="order/view-history/:id" element={<ViewHistory />} />
            {/* Contact */}
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="contact/create-contact" element={<CreateContact />} />
            <Route path="contact/trash-contact" element={<TrashContact />} />
            {/* Menu */}
            <Route path="menu" element={<Menu />} />
            <Route path="menu/create-menu" element={<CreateMenu />} />
            <Route path="menu/trash-menu" element={<TrashMenu />} />
            {/* Slide */}
            <Route path="slide" element={<Slide />} />
            {/* Revenue */}
            <Route path="revenue" element={<RevenueWeb />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes >
    </>
  );
}

export default App;
