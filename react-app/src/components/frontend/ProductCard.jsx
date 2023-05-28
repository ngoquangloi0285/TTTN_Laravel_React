import React, { useEffect, useRef, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from '../../api/axios';

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
                                <div className="product-card position-relative shadow">
                                    <div className='discount position-absolute'>
                                        <span>{product.discount === null ? "" : `down ${parseInt(product.discount)}%`}</span>
                                    </div>
                                    <div className='discount position-absolute'>
                                        <span>{product.type === 'new_product' ? 'New Product' : ''}</span>
                                    </div>
                                    <Link to={`../product-detail/${product.slug}`} className='d-flex justify-content-center'
                                        >
                                        <div className="product-image">
                                            <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} width="100%" alt={product.name_product} />
                                            {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                                        </div>
                                    </Link >
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
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                        ))
                    )
            }
        </>
    )
}

