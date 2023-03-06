import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import Maps from '../components/Maps'
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';

const OurStore = () => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };

    const [value, setValue] = useState("");

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (isNaN(newValue)) {
            alert("Vui lòng chỉ nhập số.");
            setValue("");
        } else {
            setValue(newValue);
        }
    };
    const [grid, setGird] = useState(4);
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
                                        <div class="form-floating">
                                            <input type="number"
                                                class="form-control"
                                                id="floatingInputValue1"
                                                placeholder=""
                                                value={value}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="floatingInputValue1">From</label>
                                        </div>
                                        <span><strong>$</strong></span>
                                        <div class="form-floating">
                                            <input type="number"
                                                class="form-control"
                                                id="floatingInputValue2"
                                                placeholder=""
                                                value={value}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="floatingInputValue2">To</label>
                                        </div>
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
                                    Product Tags
                                </h3>
                                <div className="d-flex flex-wrap align-items-center gap-10">
                                    <span className="badge bg-success text-light rounded-3 py-2 px-3">
                                        Headphone
                                    </span>
                                    <span className="badge bg-success text-light rounded-3 py-2 px-3">
                                        Laptop
                                    </span>
                                    <span className="badge bg-success text-light rounded-3 py-2 px-3">
                                        TV
                                    </span>
                                    <span className="badge bg-success text-light rounded-3 py-2 px-3">
                                        SmartPhone
                                    </span>
                                </div>
                            </div>
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Random Product
                                </h3>
                                <div>
                                    <div className="random-products d-flex ">
                                        <div className="w-50">
                                            <img className='img-fluid' src="images/watch.jpg" alt="watch" />
                                        </div>
                                        <div className="w-50">
                                            <h5>Kids headphones bluk 10 pack</h5>
                                            <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                size={24}
                                                value="4"
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                            <b>$100</b>
                                        </div>
                                    </div>
                                    <div className="random-products d-flex ">
                                        <div className="w-50">
                                            <img className='img-fluid' src="images/watch.jpg" alt="watch" />
                                        </div>
                                        <div className="w-50">
                                            <h5>Kids headphones bluk 10 pack</h5>
                                            <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                size={24}
                                                value="4"
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                            <b>$100</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="filter-sort-gird mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-10">
                                        <p className='mb-0 title-sort d-block'>Sort By:</p>
                                        <select className='form-control form-select' name="" id="">
                                            <option value="" selected>Best Selling</option>
                                            <option value="">Featured</option>
                                            <option value="">Price, low to high</option>
                                            <option value="">Price, high to low</option>
                                            <option value="">Date, old to new</option>
                                            <option value="">Date, new to old</option>
                                        </select>
                                    </div>
                                    <div className="d-flex align-items-center gap-10">
                                        <p className='m-0 totalproducts'>21 Products</p>
                                        <div className="d-flex align-items-center gap-10 gird">
                                            <img onClick={() => {
                                                setGird(3)
                                            }}
                                                className='d-block img-fluid' src="images/gr4.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(4)
                                            }}
                                                className='d-block img-fluid' src="images/gr3.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(6)
                                            }}
                                                className='d-block img-fluid' src="images/gr2.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(12)
                                            }}
                                                className='d-block img-fluid' src="images/gr.svg" alt="gird" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="products-list pd-5">
                                <div className="d-flex flex-wrap gap-10">
                                    <ProductCard grid={grid} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OurStore