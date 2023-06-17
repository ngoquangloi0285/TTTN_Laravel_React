import React, { useEffect, useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import moment from 'moment';

// import './special.css'
const SpecialProducts = (props) => {

    const special = props.special
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [brandMap, setBrandMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productResponse, categoryResponse, brandResponse] = await Promise.all([
                    axios.get('/api/product/v1/get_data', {
                        params: {
                            specialProduct: special
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
                // Tính số ngày giữa start_time và end_time
                const updatedProductList = productResponse.data.map(product => {
                    const start = moment(product.start_time);
                    const end = moment(product.end_time);
                    const duration = moment.duration(end.diff(start));
                    const days = duration.asDays();
                    return {
                        ...product,
                        durationInDays: days
                    };
                });
                setProductList(updatedProductList);
                setCategoryMap(newCategoryMap);
                setBrandMap(newBrandMap);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [special]);

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
                            </div>
                        </div>
                    </div>
                ) :
                    (
                        productList.map((product) => (
                            <div className='gr-6'>
                                <div className="special-product-card shadow m-3 position-relative">
                                    <div className="d-flex justify-content-around ">
                                        <div className='discount-special position-absolute'>
                                            <span>{product.discount === null ? "" : `Giảm ${parseInt(product.discount)}%`}</span>
                                        </div>
                                        <div className='special-right position-absolute'>
                                            <span>Giá quá rẻ</span>
                                        </div>
                                        <div className='px-5'>
                                            <Link to={`../product-detail/${product.slug}`}>
                                                <img
                                                    className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                            </Link>
                                        </div>
                                        <div className="special-product-content">
                                            <h5 className='bran'>{categoryMap[product.category_id]}</h5>
                                            <p className="text-danger brand m-0">
                                                {brandMap[product.brand_id]}
                                            </p>
                                            <p className='title mt-2'>
                                                {product.name_product}
                                            </p>
                                            {product.start_time && product.end_time && (
                                                <>
                                                    {moment(product.end_time).diff(moment(), 'days') > 0 ? (
                                                        <p className="m-0">
                                                            Thời gian còn lại: <span>{moment(product.end_time).diff(moment(), 'days')} ngày</span>
                                                        </p>
                                                    ) : (
                                                        <h5 className="m-0 text-danger">Nhanh tay nhận ưu đãi!</h5>
                                                    )}
                                                </>
                                            )}
                                            <p className="price">
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
                                            <Link to={`../product-detail/${product.slug}`} className='btn btn-special'>
                                                Xem thông tin sản phẩm
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        ))
                    )
            }
        </>
    )
}

export default SpecialProducts