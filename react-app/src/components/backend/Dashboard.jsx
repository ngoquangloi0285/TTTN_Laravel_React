import React from 'react'
import { BiLogOut } from 'react-icons/bi';
import { Link, Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <>
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="header-dashboard home-wrapper-2">
                <nav className="navbar navbar-expand-lg bg-primary shadow">
                  <div className="container-fluid ">
                    <Link className="text-white navbar-brand" to="/admin">Dashboard</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          <Link className="text-white nav-link active" aria-current="page" to="/admin">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                          <Link className="text-white nav-link dropdown-toggle" to="/admin" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                          </Link>
                          <ul className="dropdown-menu">
                            <div className="row">
                              <li><Link className="dropdown-item" href="/admin">Action</Link></li>
                            </div>
                          </ul>
                        </li>
                      </ul>
                      <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                        />
                        <button className="btn text-white btn-outline-dark" type="submit" onClick={(e) => {
                          e.preventDefault();

                        }} >Search</button>
                      </form>

                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
    </>
  )
}

export default Dashboard