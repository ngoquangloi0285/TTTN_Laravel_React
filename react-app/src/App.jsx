import './App.css';
import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Layout from './components/frontend/Layout';
import Home from './pages/frontend/Home';
import About from './pages/frontend/About';
import Contact from './pages/frontend/Contact';
import OurStore from './pages/frontend/OurStore';
import Blog from './pages/frontend/Blog';
import CompareProduct from './pages/frontend/CompareProduct';
import NotFound from './pages/NotFound';
import Dashboard from './components/backend/Dashboard';
function App() {
  return (
    <>
    <Layout/>
    
      {/* <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='admin' element={<Dashboard />}>

            </Route>
            <Route path='blog' element={<Blog/>}>

            </Route>
            <Route path="store" element={<OurStore/>} >

            </Route>

            <Route path="compare-product" element={<CompareProduct/>} />
            <Route path='contact' element={<Contact/>} />
            <Route path='about' element={<About/>} />
            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
      </BrowserRouter> */}
    </>
  );
}

export default App;
