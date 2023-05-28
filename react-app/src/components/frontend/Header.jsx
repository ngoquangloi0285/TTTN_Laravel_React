import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Link, useNavigate, Route, Routes } from "react-router-dom";
import { BsCartCheck, BsSearch, BsShop } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { RiAccountCircleLine } from "react-icons/ri";
import useAuthContext from "../../context/AuthContext";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdSwitchAccount } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "../../api/axios";
import Search from "./Search";

const Header = () => {
  const { currentUser, logout } = useAuthContext();

  const [menuList, setMenuList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [menuResponse, categoryResponse] = await Promise.all([
        axios.get('/api/menu/v1/menus'),
        axios.get('/api/category/v1/category')
      ]);

      const categoryMap = {};
      const categoryList = categoryResponse.data;

      categoryList.forEach((category) => {
        categoryMap[category.id] = category;
        category.children = []; // Thêm thuộc tính children cho mỗi category
      });

      const categoryTree = [];
      categoryList.forEach((category) => {
        if (category.parent_category) {
          // Nếu category có parent_category, thêm nó vào danh sách con của category cha tương ứng
          categoryMap[category.parent_category].children.push(category);
        } else {
          // Nếu không có parent_category, nó là category gốc, thêm vào danh sách gốc
          categoryTree.push(category);
        }
      });

      setMenuList(menuResponse.data);
      setCategoryList(categoryTree);
      setCategoryMap(categoryMap);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      {/* {`The current page is: ${location}`} */}
      {/* header top */}
      <ToastContainer />
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              {
                currentUser ? <h5 className="mb-0 text-warning">
                  Welcome to Our web page!
                </h5> :
                  <h5 className="mb-0 text-warning">
                    Bạn chưa đặng nhập!
                  </h5>
              }
            </div>
            <div className="col-6">
              <p className="text-end text-white mb-0">
                Hotline:
                <a className="text-white" href="tel: 0382983095">
                  (+84) 0382983095
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* end header top */}

      {/* header upper */}
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-2">
              <Link to="/" className="text-white">
                <h2 className="mb-0 header-link d-flex align-items-between">
                  <BsShop style={{
                    fontSize: '3rem'
                  }} />
                  E-Shop</h2>
              </Link>
            </div>
            <div className="col-6">
              <Search />
            </div>
            <div className="col-3">
              <div className="header-upper-links d-flex justify-content-center align-items-center">
                <div className="mx-2">
                  <div className="d-flex align-items-center gap-10">
                    <img src="images/user.svg" alt="user" />
                    <p className="mb-0">
                      {currentUser ? (<>
                        {/* Hello! <strong>{user?.name}</strong> <br /> */}
                        <div className="dropdown">
                          <button
                            className="btn btn-secondary dropdown-toggle bg-transparent border-0 d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span className="me-1 d-inline-block header-link">
                              {
                                currentUser?.roles === 'admin' ? "Admin" : currentUser.name
                              }
                            </span>
                          </button>
                          <ul className="dropdown-menu">

                            <li>
                              <Link to="../profile" className="dropdown-item">
                                Profile <MdSwitchAccount className="icon-item" />
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                Order <BsCartCheck className="icon-item" />
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="change-password">
                                Change Password <RiAccountCircleLine className="icon-item" />
                              </Link>
                            </li>
                            {currentUser?.roles === "admin" ? (
                              <li>
                                <Link className="dropdown-item" to="admin">
                                  Dashboard <AiOutlineDashboard className="icon-item" />
                                </Link>
                              </li>
                            ) : (
                              " "
                            )
                            }
                            <li>
                              <button onClick={logout} className="dropdown-item header-btn d-block header-link">Logout <BiLogOut className="icon-item" /></button>
                            </li>
                          </ul>
                        </div>
                      </>) :
                        (
                          <>
                            <Link className="text-white header-link" to="login">Login</Link> / <br />
                            <Link className="text-white header-link" to="signup">Register</Link>
                          </>
                        )}
                    </p>
                  </div>
                </div>
                <div>
                  <Link to="/cart" className="d-flex align-items-center gap-10 text-white">
                    <img src="images/cart.svg" alt="cart" />
                    <div className="d-flex flex-column gap-10">
                      <span className="badge bg-white text-dark">0</span>
                      {/* <p className="mb-0 header-link">$ 500</p> */}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* header end upper */}

      {/* header bottom */}
      <header className="header-bottom py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center gap-30">
                <div>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="me-5 d-inline-block header-link">Shop Categories</span>
                    </button>
                    <ul class="dropdown-menu">
                      {categoryList.map((category) => (
                        <li key={category.id} class="dropdown-submenu">
                          <Link to={`../category/${category.slug}`} class="dropdown-item dropdown-toggle text-dark" href="#">{category.name_category}</Link>
                          {category.children.length > 0 && (
                            <ul class="dropdown-menu">
                              {category.children.map((subcategory) => (
                                <li key={subcategory.id}>
                                  <Link to={`../category/${subcategory.slug}`} class="dropdown-item text-dark" href="#">
                                    {subcategory.name_category}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="menu-links">
                  <div className="d-flex align-items-center gap-15">
                    {
                      isLoading ?
                        <>
                          <NavLink className="header-link" to="/">Home</NavLink>
                          <NavLink className="header-link" to="store">Our Store</NavLink>
                          <NavLink className="header-link" to="contact">Contact</NavLink>
                          <NavLink className="header-link" to="blog">Blog</NavLink>
                        </>
                        :
                        menuList.map(menu => (
                          <NavLink className="header-link" to={menu.link}>{menu.name}</NavLink>
                        ))
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* header end bottom */}
    </>
  );
};

export default Header;