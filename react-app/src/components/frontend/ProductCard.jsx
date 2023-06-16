import React, { useEffect, useRef, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../state/cartSlice';
import { FaStar } from 'react-icons/fa';
import { FaStarHalf } from 'react-icons/fa';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const fetchData = async (newProduct, suggestion, saleProduct, relatedproducts, setProductList, setCategoryMap, setIsLoading, setBrandMap) => {
    setIsLoading(true);
    try {
        const [productResponse, categoryResponse, brandResponse] = await Promise.all([
            axios.get('/api/product/v1/get_data', {
                params: {
                    newProduct: newProduct,
                    saleProduct: saleProduct,
                    suggestion: suggestion,
                    relatedproducts: relatedproducts,
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
        const newBrandMap = {};
        brandResponse.data.forEach((brand) => {
            newBrandMap[brand.id] = brand.name;
        });
        setProductList(productResponse.data);
        setCategoryMap(newCategoryMap);
        setBrandMap(newBrandMap);
        setIsLoading(false);
    } catch (error) {
        console.log(error);
        setIsLoading(false);
    }
};

export const ProductList = (props) => {

    const relatedproducts = props.relatedproducts

    // const { slug } = useParams(); // lấy ID từ URL

    const newProduct = props.newProduct
    const saleProduct = props.saleProduct
    const suggestion = props.suggestion

    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [brandMap, setBrandMap] = useState({});
    const [categoryMap, setCategoryMap] = useState({});
    const fetchDataRef = useRef(null);

    useEffect(() => {
        fetchDataRef.current = fetchData;
    }, []);

    useEffect(() => {
        const { current: fetchData } = fetchDataRef;
        if (!fetchData) return;

        fetchData(newProduct, suggestion, saleProduct, relatedproducts, setProductList, setCategoryMap, setIsLoading, setBrandMap);
    }, [newProduct, suggestion, saleProduct, relatedproducts]);

    return (
        <>
            {
                isLoading ? (
                    <div className="row">
                        {/* <h1>Loading...</h1>
                        <ProductPlaceholder/> */}
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
                            <div key={product.id} className="gr-4">
                                <Link to={`../product-detail/${product.slug}`} className="product-card position-relative">
                                    <div className='discount position-absolute'>
                                        <span>{product.discount === null ? "" : `Giảm ${parseInt(product.discount)}%`}</span>
                                    </div>
                                    <div className='discount position-absolute'>
                                        <span>{product.type === 'new_product' ? 'Sản phẩm mới' : ''}</span>
                                    </div>
                                    <div className="product-image">
                                        <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} width="100%" alt={product.name_product} />
                                        {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                                    </div>
                                    <div className="row">
                                        <p className="text-dark m-0">
                                            {categoryMap[product.category_id]}
                                        </p>
                                        <p className="text-danger brand m-0">
                                            {brandMap[product.brand_id]}
                                        </p>
                                        <p className='product-title'>
                                            {product.name_product}
                                        </p>
                                        <p className="price" id='price'>
                                            <strong>
                                                {calculateDiscountedPrice(product.price, product.discount).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </strong>
                                            &nbsp;
                                            <span className="original-price">
                                                {product.discount === null ? (
                                                    ''
                                                ) : (
                                                    <span className="original-price">
                                                        {product.discount === null ? '' : (
                                                            <del>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                            </del>
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        </p>
                                        <div className="react_start d-flex">
                                            <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                            <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                            <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                            <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                            <FaStarHalf style={{ color: '#ffd700', fontSize: '20px' }} />
                                        </div>
                                    </div>
                                    <Link to={`../product-detail/${product.slug}`}
                                        className="add-to-cart"
                                    >
                                        Xem thông tin sản phẩm
                                    </Link>
                                </Link>
                            </div>
                        ))
                    )
            }
            {
                productList.length === 0 && <p>Không có sản phẩm liên quan!</p>
            }
        </>
    )
}

