import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import ReactStars from "react-rating-stars-component";

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}
const CategoryProduct = (props) => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const slug = props.slug; // lấy ID từ URL
    console.log(slug);
    let location = useLocation();
    const [grid, setGird] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [filter, setFilter] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse, categoryResponse, brandResponse] = await Promise.all([
                    axios.get('/api/product/v1/products', {
                        params: {
                            slug: slug,
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }),
                    axios.get('/api/category/v1/category'),
                    axios.get('/api/brand/v1/brand'),
                ]);

                const newCategoryMap = {};
                categoryResponse.data.forEach((category) => {
                    newCategoryMap[category.id] = category.name_category;
                });
                setProductList(productResponse.data);
                setBrandList(brandResponse.data)
                setCategoryMap(newCategoryMap);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filter, slug]);

    return (
        <>
            <div className="d-flex flex-wrap gap-10">
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
                                    className="card-img-top placeholder-glow placeholder" alt="" />
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
                    ) :
                        (
                            productList.map((product) => (
                                <div key={product.id} className='gr-4'>
                                    <div className='product-card position-relative shadow'>

                                        <div className='discount position-absolute'>
                                            <span>{product.discount === null ? "" : `down ${parseInt(product.discount)}%`}</span>
                                        </div>
                                        <div className='discount position-absolute'>
                                            <span>{product.type === 'new_product' ? 'New Product' : ''}</span>
                                        </div>
                                        <Link to={`../product-detail/${product.slug}`} className="d-flex justify-content-center">
                                            <div className="product-image">
                                                <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                            </div>
                                        </Link>

                                        <div className="product-detail">
                                            <div className="row">
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
                                                    <span className="original-price"><del>{product.discount === null ? '' : `$ ${product.price}`}</del></span>
                                                </p>
                                                <p className={`description ${grid === 12 ? "d-block" : "d-none"} `}>
                                                    {product.summary}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="add-to-cart"
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>

                            ))
                        )
                }
                {/* {
                    productList.length === 0 && <h1>Không có sản phẩm nào!</h1>
                } */}
            </div>
        </>
    )
}

export default CategoryProduct