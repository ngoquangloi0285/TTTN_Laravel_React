import React from 'react'
import Navbar from '../Layouts/Navbar'
import { Link, Outlet } from 'react-router-dom';
import '../../../assets/dist/css/adminlte.min.css'
import useAuthContext from '../../../context/AuthContext';
import { BiLogOutCircle } from 'react-icons/bi';
import Meta from '../../frontend/Meta';
import { AiOutlineEye } from 'react-icons/ai';

const MasterLayout = () => {
    const { currentUser, logout } = useAuthContext();
    // Middleware check if user is an admin
    if (currentUser && currentUser.roles !== "admin") {
        return <h1>Bạn không có quyền truy cập</h1>;
    }

    return (
        <>
            <Meta title={"Dashboard"} />
            <div className="hold-transition sidebar-mini layout-fixed">
                <div className="wrapper">
                    {/* Navbar */}
                    <Navbar />
                    {/* /.navbar */}
                    {/* Main Sidebar Container */}
                    <aside className="main-sidebar sidebar-dark-primary elevation-4"
                        style={
                            {
                                background: "#213555",
                            }
                        }
                    >
                        {/* Sidebar */}
                        <div className="sidebar">
                            {/* Sidebar user panel (optional) */}
                            <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
                                <div className="image">
                                    {!currentUser.avatar ?
                                        <img src="https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png" alt="null" /> :
                                        <img src={`http://localhost:8000/storage/user/${currentUser.avatar}`} alt={currentUser.avatar} />
                                    }
                                </div>
                                <div className="info">
                                    <Link to="#" className="d-block fs-4">{currentUser?.name}</Link>
                                    <br />
                                    <div className="row">
                                        <button onClick={logout} style={{
                                            borderRadius: '20px',
                                            border: 'none'
                                        }}>Đăng xuất<BiLogOutCircle /></button>
                                    </div>
                                </div>
                            </div>
                            {/* SidebarSearch Form */}
                            {/* <div className="form-inline">
                                <div className="input-group" data-widget="sidebar-search">
                                    <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                    <div className="input-group-append">
                                        <button className="btn btn-sidebar">
                                            <i className="fas fa-search fa-fw" />
                                        </button>
                                    </div>
                                </div>
                            </div> */}
                            {/* Sidebar Menu */}
                            <nav className="mt-2">
                                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Thống kê<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="product" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý thống kế</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý sản phẩm<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="product" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý sản phẩm</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý danh mục<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="category" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý danh mục</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý thương hiệu<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="brand" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý thương hiệu</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý tin tức<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="news" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý tin tức</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý người dùng<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="user" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý người dùng</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Liên hệ người dùng<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="contact" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Liên hệ người dùng</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý đơn hàng<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="order" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý đơn hàng</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý thanh điều hướng(Menu)<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="menu" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý thanh điều hướng</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Quản lý trình chiếu sản phẩm(Slide)<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="slide" className="nav-link d-flex">
                                                    {/* <i className="far fa-circle nav-icon" /> */}
                                                    <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />
                                                    <p>Quản lý trình chiếu sản phẩm</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                </ul>
                            </nav>
                            {/* /.sidebar-menu */}
                        </div>
                        {/* /.sidebar */}
                    </aside>
                    {/* Content Wrapper. Contains page content */}
                    <div className="content-wrapper">
                        {/* Content Header (Page header) */}
                        <div className="container-fluid">
                            <div className="row mx-3">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                    {/* /.content-wrapper */}
                    <footer className="main-footer">
                        <strong>
                            &copy; {new Date().getFullYear()}
                            <Link to="https://adminlte.io">Development by Ngo Quang Loi</Link>.All rights reserved.
                        </strong>
                        <div className="float-right d-none d-sm-inline-block">
                            <b>Version</b> 3.2.0
                        </div>
                    </footer>
                    {/* Control Sidebar */}
                    <aside className="control-sidebar control-sidebar-dark">
                        {/* Control sidebar content goes here */}
                    </aside>
                    {/* /.control-sidebar */}
                </div>
                {/* ./wrapper */}
            </div>
        </>
    )
}

export default MasterLayout