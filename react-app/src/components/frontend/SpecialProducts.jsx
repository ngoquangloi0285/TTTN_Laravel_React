import React from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'

const SpecialProducts = () => {
    return (
        <div className='col-6 mb-4'>
            <div className="special-product-card shadow">
                <div className="d-flex justify-content-around">
                    <div>
                        <Link>
                            <img className='img-fluid' src="images/watch.jpg" alt="" />
                        </Link>
                    </div>
                    <div className="special-product-content">
                        <h5 className='bran'>Samsung</h5>
                        <h6 className='title'>
                            Samsung Glaxy Note1+ Mobile
                        </h6>
                        <ReactStars
                            count={5}
                            size={24}
                            value={4}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <p className="price"><span className='red-p'>$100</span> &nbsp; <strike>$200</strike> </p>
                        <div className="discount-till d-flex align-items-center">
                            <p className='mb-0 d-flex align-items-center gap-2'>
                                <b>5 </b>days
                            </p>
                            <div className="d-flex gap-10 align-items-center">
                                <span className='badge rounded-circle circle-day bg-danger'>12</span>:
                                <span className='badge rounded-circle circle-day bg-danger'>00</span>:
                                <span className='badge rounded-circle circle-day bg-danger'>00</span>
                            </div>

                        </div>
                        <div className="prod-count my-3">
                            <p>Product: 5</p>
                            <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar bg-success" style={{ "width": "25%" }}></div>
                            </div>
                        </div>
                        <div className="">
                            <Link className='button'>
                                Add to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpecialProducts