import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></Link>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to="/" className="nav-link">Back Your Shop</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar
