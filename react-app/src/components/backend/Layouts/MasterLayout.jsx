import React from 'react'
import Navbar from '../Layouts/Navbar'
import { Link, Outlet } from 'react-router-dom';
import '../../../assets/dist/css/adminlte.min.css'
import useAuthContext from '../../../context/AuthContext';
import { BiLogOutCircle } from 'react-icons/bi';

const MasterLayout = () => {
    const { user, logout } = useAuthContext();
    return (
        <>
            <div className="hold-transition sidebar-mini layout-fixed">
                <div className="wrapper">
                    {/* Navbar */}
                    <Navbar />
                    {/* /.navbar */}
                    {/* Main Sidebar Container */}
                    <aside className="main-sidebar sidebar-dark-primary elevation-4">
                        {/* Sidebar */}
                        <div className="sidebar">
                            {/* Sidebar user panel (optional) */}
                            <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
                                <div className="image">
                                    <img src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t39.30808-6/331380015_934924297535026_3835223002760103639_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=8RnFvjrS5eoAX8kY2hb&_nc_ht=scontent.fsgn3-1.fna&oh=00_AfAU_BD0Ag2padr817dFLVafKBFez2RsPQUx2Bl6zEiOdQ&oe=64374E24" className="img-circle elevation-2 img img-fluid" alt="User Image" />
                                </div>
                                <div className="info">
                                    <Link to="#" className="d-block fs-4">{user?.name}</Link>
                                    <br />
                                    <div className="row">
                                        <button onClick={logout} style={{
                                            borderRadius: '20px',
                                            border: 'none'
                                            }}>Logout <BiLogOutCircle/></button>
                                    </div>
                                </div>
                            </div>
                            {/* SidebarSearch Form */}
                            <div className="form-inline">
                                <div className="input-group" data-widget="sidebar-search">
                                    <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                    <div className="input-group-append">
                                        <button className="btn btn-sidebar">
                                            <i className="fas fa-search fa-fw" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Sidebar Menu */}
                            <nav className="mt-2">
                                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                    <li className="nav-item">
                                        <Link to="#" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Product<i className="right fas fa-angle-left" /></p>
                                        </Link>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="product" className="nav-link">
                                                    <i className="far fa-circle nav-icon" />
                                                    <p>Product</p>
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