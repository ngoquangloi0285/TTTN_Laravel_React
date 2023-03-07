import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/frontend/Layout';
import Home from './pages/frontend/Home';
import About from './pages/frontend/About';
import Contact from './pages/frontend/Contact';
import OurStore from './pages/frontend/OurStore';
import Blog from './pages/frontend/Blog';
import CompareProduct from './pages/frontend/CompareProduct';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<About/>} />
            <Route path='contact' element={<Contact/>} />
            <Route path='blog' element={<Blog/>} />
            <Route path="store" element={<OurStore/>} />
            <Route path="compare-product" element={<CompareProduct/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
