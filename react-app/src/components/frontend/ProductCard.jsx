import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
const ProductCard = (props) => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const { grid } = props;
    let location = useLocation();
    console.log(location);
    return (
        <>
            <div className={` ${location.pathname === '/store' ? `gr-${grid}` : "col-3"} `}>
                <Link className="product-card position-relative shadow ">
                    <div className="wishlist-icon position-absolute">
                        <Link>
                            <img src="images/wish.svg" alt="wishlist" />
                        </Link>
                    </div>
                    <div className="product-image">
                        <img className='img-fluid' src="images/watch.jpg" alt="" />
                        <img className='img-fluid' src="images/tab1.jpg" alt="" />
                    </div>
                    <div className="product-detail">
                        <h6 className="brand">Samsung</h6>
                        <h5 className='product-title'>
                            Kids headphones bulk 10 pack
                        </h5>
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            value="4"
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <p className="price"><strong>$100</strong></p>
                        <p className={`description ${grid === 12 ? "d-block" : "d-none"} `}>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur incidunt error quisquam repellat ipsa maxime ullam deleniti sequi nihil saepe nisi, doloremque cum blanditiis eos nemo fuga quaerat sapiente quod!
                        </p>
                    </div>
                    <div className="action-bar position-absolute">
                        <div className="d-flex flex-column gap-15">
                            <Link to='/about'><img src="images/prodcompare.svg" alt="add-cart" /></Link>
                            <Link to='/contact'><img src="images/add-cart.svg" alt="add-cart" /></Link>
                            <Link to='/blog'><img src="images/view.svg" alt="add-cart" /></Link>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default ProductCard