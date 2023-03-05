import React from 'react'
import { Link } from 'react-router-dom';
import Maps from '../components/Maps'
import Meta from '../components/Meta';

const OurStore = () => {
    return (
        <>
            <Meta title={"Our Store"} />
            <Maps title="Our Store" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-3">
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Shop By Categories
                                </h3>
                                <div className='container'>
                                    <div className="row filter-mx">
                                        <div className="col-3">
                                            <ul className="ps-0">
                                                <li><Link to="">Watch</Link></li>
                                                <li><Link to="">TV</Link></li>
                                                <li><Link to="">Camera</Link></li>
                                                <li><Link to="">Laptop</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Filter By
                                </h3>
                                <div>
                                    <h5 className="sub-title">
                                        Availablity
                                    </h5>
                                    <div>
                                        <div className="form-check">
                                            <input
                                                className='form-check-input'
                                                type="checkbox"
                                                value=""
                                                id="in-stock" />
                                            <label className='form-check-label' htmlFor="in-stock">
                                                In Stock (1)
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className='form-check-input'
                                                type="checkbox"
                                                value=""
                                                id="out-stock"
                                            />
                                            <label className='form-check-label' htmlFor="out-stock">
                                                Out of Stock (0)
                                            </label>
                                        </div>
                                    </div>
                                    <h5 className="sub-title">
                                        Price
                                    </h5>
                                    <div className="d-flex align-items-center gap-10">
                                        <span><strong>$</strong></span>
                                        <form class="form-floating">
                                            <input type="email"
                                                class="form-control"
                                                id="floatingInputValue1"
                                                placeholder=""
                                            />
                                            <label htmlFor="floatingInputValue1">From</label>
                                        </form>
                                        <span><strong>$</strong></span>
                                        <form class="form-floating">
                                            <input type="email"
                                                class="form-control"
                                                id="floatingInputValue2"
                                                placeholder=""
                                            />
                                            <label htmlFor="floatingInputValue2">To</label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Colors
                                </h3>
                                <div className="d-flex flex-wrap">
                                    <ul className="colors">
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </div>
                                <h3 className="filter-title">
                                    Size
                                </h3>
                                <div className="form-check">
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        value=""
                                        id="size-s" />
                                    <label className='form-check-label' htmlFor="size-s">
                                        S (1)
                                    </label>
                                </div>
                            </div>
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Random Product
                                </h3>
                            </div>
                        </div>
                        <div className="col-9">

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OurStore