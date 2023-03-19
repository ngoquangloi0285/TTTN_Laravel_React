import React from "react";
import { NavLink, Link } from "react-router-dom";
import { BsCartCheck, BsSearch } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { RiAccountCircleLine } from "react-icons/ri";
import useAuthContext from "../../context/AuthContext";
import { AiFillDashboard, AiOutlineDashboard } from "react-icons/ai";

const Header = () => {
  const { user } = useAuthContext();
  const { logout } = useAuthContext();
  return (
    <>
      {/* header top */}
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <h5 className="mb-0 text-warning">
                Welcome to Our web page!
              </h5>
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
                <h2 className="mb-0 header-link">Dev ALTT</h2>
              </Link>
            </div>
            <div className="col-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="Search Product Here..."
                  aria-label="Search Product Here..."
                  aria-describedby="basic-addon2"
                />
                <button className="input-group-text py-3" id="basic-addon2">
                  <BsSearch className="fs-6" />
                </button>
              </div>
            </div>
            <div className="col-5">
              <div className="header-upper-links d-flex justify-content-between align-items-center">
                <div>
                  <Link to='/compare-product' className="d-flex align-items-center gap-10 text-white">
                    <img src="images/compare.svg" alt="compare" />
                    <p className="mb-0 header-link">
                      Compare <br /> Products{" "}
                    </p>
                  </Link>
                </div>
                <div>
                  <Link to="/wishlist" className="d-flex align-items-center gap-10 text-white">
                    <img src="images/wishlist.svg" alt="wishlist" />
                    <p className="mb-0 header-link">
                      Favourit <br /> Wishlist{" "}
                    </p>
                  </Link>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-10">
                    <img src="images/user.svg" alt="user" />
                    <p className="mb-0">
                      {user ? (<>
                        {/* Hello! <strong>{user?.name}</strong> <br /> */}
                        <div className="dropdown">
                          <button
                            className="btn btn-secondary dropdown-toggle bg-transparent border-0 d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span className="me-1 d-inline-block header-link">
                              {user?.name}
                            </span>
                          </button>
                          <ul className="dropdown-menu">
                          {user?.roles === "admin" ? (
                              <li>
                                <Link className="dropdown-item" to="admin">
                                  Admin <AiOutlineDashboard className="icon-item" />
                                </Link>
                              </li>
                            ) : (
                              " "
                            )
                            }
                            <li>
                              <Link className="dropdown-item" to="#">
                                My account <RiAccountCircleLine className="icon-item" />
                              </Link>
                            </li>

                            <li>
                              <Link className="dropdown-item" to="#">
                                Order <BsCartCheck className="icon-item" />
                              </Link>
                            </li>
                            
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
                      <p className="mb-0 header-link">$ 500</p>
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
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-5 d-inline-block header-link">
                        Shop Categories
                      </span>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item text-white" to="#">
                          Action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="#">
                          Another action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="#">
                          Something else here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-15">
                    <NavLink className="header-link" to="/">Home</NavLink>
                    <NavLink className="header-link" to="store">Our Store</NavLink>
                    <NavLink className="header-link" to="about">About</NavLink>
                    <NavLink className="header-link" to="contact">Contact</NavLink>
                    <NavLink className="header-link" to="blog">Blog</NavLink>
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