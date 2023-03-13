import React from 'react'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const Wishlist = () => {
    return (
        <>
            <Meta title={"Wishlist Product"} />
            <Maps title="Wishlist roduct" />
            <div className="wishlist-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-3">
                            <div className="wishlist-card  shadow position-relative">
                                <img src="images/cross.svg" alt="cross"
                                    className='position-absolute img-fluid cross' />
                                <Link to="/store">
                                    <div className="wishlist-card-image">
                                        <img className='img-fluid w-100' src="images/watch.jpg" alt="" />
                                    </div>
                                </Link>
                                <div className='py-3'>
                                    <h5 className="title">
                                        Honor T1 7.0 1 GB RAM 8 GB ROM Inch With Wi-Fi+3G Tablet
                                    </h5>
                                    <h6 className='price'>
                                        <strong className='text-danger'><del>$500 </del></strong>
                                        <span>&nbsp; $100</span>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wishlist