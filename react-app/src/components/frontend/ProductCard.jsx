import React, { useEffect, useRef, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../state/cartSlice';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const fetchData = async (slug, newProduct, suggestion, saleProduct, setProductList, setCategoryMap, setIsLoading, setBrandMap) => {
    setIsLoading(true);
    try {
        const [productResponse, categoryResponse, brandResponse] = await Promise.all([
            axios.get('/api/product/v1/products', {
                params: {
                    newProduct: newProduct,
                    saleProduct: saleProduct,
                    slug: slug,
                    suggestion: suggestion,
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
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const relatedproducts = props.relatedproducts
    console.log(relatedproducts)
    const { slug } = useParams(); // lấy ID từ URL
    const newProduct = props.newProduct
    const saleProduct = props.saleProduct
    console.log(saleProduct)
    const suggestion = props.suggestion
    console.log(suggestion)
    const { grid } = props;
    let location = useLocation();
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

        fetchData(slug, newProduct, suggestion, saleProduct, setProductList, setCategoryMap, setIsLoading, setBrandMap);
    }, [slug, newProduct, suggestion, saleProduct]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        dispatch(addToCart({ item: { ...product, count: 1 } }));
        navigate("../cart");
    };

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
                ) :
                    (
                        productList.map((product) => (
                            <div key={product.id} className="gr-4">
                                <Link to={`../product-detail/${product.slug}`} className="product-card position-relative shadow">
                                    <div className='discount position-absolute'>
                                        <span>{product.discount === null ? "" : `Giảm ${parseInt(product.discount)}%`}</span>
                                    </div>
                                    <div className='discount position-absolute'>
                                        <span>{product.type === 'new_product' ? 'New Product' : ''}</span>
                                    </div>
                                    <div className="product-image">
                                        <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} width="100%" alt={product.name_product} />
                                        {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                                    </div>
                                    <div className="product-detail">
                                        <div className="row">
                                            <p className="text-dark m-0">
                                                {categoryMap[product.category_id]}
                                            </p>
                                            <p className="text-danger brand m-0">
                                                {brandMap[product.brand_id]}
                                            </p>
                                            <h5 className='product-title'>
                                                {product.name_product}
                                            </h5>
                                            {/* <p className='product-summary m-0'>
                                                {product.summary}
                                            </p> */}
                                            <div className="react_start d-flex">
                                                <ReactStars
                                                    count={5}
                                                    onChange={ratingChanged}
                                                    size={24}
                                                    value="4"
                                                    edit={false}
                                                    activeColor="#ffd700"
                                                />
                                                <p className='m-0'>({product.total})</p>
                                            </div>
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

                                            {/* <p className={`description ${grid === 12 ? "d-block" : "d-none"} `}>
                                                {product.total}
                                            </p> */}
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
        </>
    )
}

