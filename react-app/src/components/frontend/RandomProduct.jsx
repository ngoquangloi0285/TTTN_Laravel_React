import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const RandomProduct = (props) => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const random = props.random;
    console.log("random", random)
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse] = await Promise.all([
                    axios.get('/api/product/v1/products', {
                        params: {
                            random: random,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);

                setProductList(productResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        const fetchDataInterval = setInterval(fetchData, 20000); // Gọi fetchData() sau mỗi 10 giây

        return () => {
            clearInterval(fetchDataInterval); // Xóa interval khi component unmounts
        };
    }, [random]);

    function calculateDiscountedPrice(price, discountPercent) {
        const discountAmount = (price * discountPercent) / 100;
        const discountedPrice = price - discountAmount;
        return discountedPrice;
    }

    return (
        <>
            {
                isLoading ? (
                    <div className="row">
                        <div className="card product-card" aria-hidden="true">
                            <img
                                style={
                                    {
                                        height: '200px',
                                    }
                                }
                                src="" className="card-img-top placeholder-glow placeholder" alt="" />
                            <div className="card-body">
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-6"></span>
                                    <span className="placeholder col-8"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    productList.map((product) => (
                        <div className="random-products d-flex position-relative">
                            <div className="w-50">
                                <Link to="#">
                                    <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                </Link>
                            </div>
                            <div className="w-50">
                                <h5>{product.name_product}</h5>
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
                                    <br />
                                    <span className="original-price"><del>{product.discount === null ? '' : `$ ${product.price}`}</del></span>
                                </p>
                            </div>
                        </div>
                    ))

                )
            }

        </>
    )
}

export default RandomProduct