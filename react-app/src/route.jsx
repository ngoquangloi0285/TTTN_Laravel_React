import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/frontend/Home'
import OurStore from './pages/frontend/OurStore'
import About from './pages/frontend/About'
import Contact from './pages/frontend/Contact'
import Blog from './pages/frontend/Blog'
import CompareProduct from './pages/frontend/CompareProduct'
import NotFound from './pages/NotFound';
import Dashboard from './components/backend/Dashboard'
import Login from './pages/frontend/Login'
import Register from './pages/frontend/Register'
import NewProduct from './components/backend/Products/NewProduct'
import EditProduct from './components/backend/Products/EditProduct'
import UpdateProduct from './components/backend/Products/UpdateProduct'
import TrashProduct from './components/backend/Products/TrashProduct'
import Product from './pages/backend/Product'

const route = createBrowserRouter([
    {
        path: '/admin',
        element: <Dashboard/>,
        children: [
            {
                path: 'products',
                element: <Product/>,
                children: [
                    {
                        path: 'new-product',
                        element: <NewProduct/>
                    },
                    {
                        path: 'edit-product',
                        element: <EditProduct/>
                    },
                    {
                        path: 'update-product',
                        element: <UpdateProduct/>
                    },
                    {
                        path: 'trash-product',
                        element: <TrashProduct/>
                    },
                ]
            }
        ]
    },
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'store',
                element: <OurStore />
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            {
                path: 'blog',
                element: <Blog />
            },
            {
                path: 'compare-product',
                element: <CompareProduct />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <Register />
            },

        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])

export default route