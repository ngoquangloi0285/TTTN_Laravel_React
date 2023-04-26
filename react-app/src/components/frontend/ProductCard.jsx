import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import ProductPlaceholder from './Placeholder';

const ProductCard = (props) => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const { grid } = props;
    let location = useLocation();
    // console.log(location);

    const [isLoading, setIsLoading] = useState(true);

    const [products, setProducts] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productResponse, categoryResponse] = await Promise.all([
                    axios.get('/api/product/v1/products'),
                    axios.get('/api/category/v1/category')
                ]);

                // lấy tên category tương ứng với category_id
                const newCategoryMap = {};
                categoryResponse.data.forEach((category) => {
                    newCategoryMap[category.id] = category.name_category;
                });

                setProducts(productResponse.data);
                setCategoryList(categoryResponse.data);
                setCategoryMap(newCategoryMap);

                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);



    if (isLoading) {
        return (
            <>
                <div className="row">
                    {Array.from({ length: products.length }).map((_, index) => (
                        <div className="col-3">
                            <ProductPlaceholder key={index} />
                        </div>
                    ))}
                </div>
            </>
        );
    }

    function calculateDiscountedPrice(price, discountPercent) {
        const discountAmount = (price * discountPercent) / 100;
        const discountedPrice = price - discountAmount;
        return discountedPrice;
    }

    return (
        <>
            {products.map((product) => (
                <div key={product.id} className={` ${location.pathname === '/store' ? `gr-${grid}` : "col-3"} `}>
                    <Link className="product-card position-relative shadow ">
                        <div className='discount position-absolute'>
                            <span>down {product.discount}%</span>
                        </div>
                        <div className="wishlist-icon position-absolute">
                            <Link>
                                <img src="images/wish.svg" alt="wishlist"
                                />
                            </Link>
                        </div>
                        <div className="product-image">
                            <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt="" />
                            {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                        </div>
                        <div className="product-detail">
                            <h6 className="brand">
                                {categoryMap[product.category_id]}
                            </h6>
                            <h5 className='product-title'>
                                {product.name_product}
                            </h5>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                value="4"
                                edit={false}
                                activeColor="#ffd700"
                            />
                            <p className="price">
                                <strong>
                                    ${calculateDiscountedPrice(product.price, product.discount)} 
                                </strong> &nbsp;
                                <span className="original-price"><del>${product.price}</del></span>
                            </p>
                            <p className={`description ${grid === 12 ? "d-block" : "d-none"} `}>
                                {product.summary}
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
            ))}
        </>
    )
}

export default ProductCard