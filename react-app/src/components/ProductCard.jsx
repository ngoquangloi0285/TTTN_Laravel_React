import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';
const ProductCard = () => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    return (
        <div className='col-3'>
            <Link className="product-card position-relative shadow ">
                <div className="wishlist-icon position-absolute">
                    <Link>
                        <img src="images/wish.svg" alt="wishlist" />
                    </Link>
                </div>
                <div className="product-image">
                    <img className='img-fluid' src="images/watch.jpg" alt="" />
                    <img className='img-fluid' src="images/watch.jpg" alt="" />
                </div>
                <div className="product-detail">
                    <h6 className="brand">Samsung</h6>
                    <h5 className='product-title'>
                        Kids headphones bulk 10 pack
                    </h5>
                    <p className="price">
                        <span>$</span>
                        <span>100</span>
                    </p>
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        value="4"
                        edit={false}
                        activeColor="#ffd700"
                    />
                </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column gap-15">
                        <Link><img src="images/prodcompare.svg" alt="add-cart" /></Link>
                        <Link><img src="images/add-cart.svg" alt="add-cart" /></Link>
                        <Link><img src="images/view.svg" alt="add-cart" /></Link>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard