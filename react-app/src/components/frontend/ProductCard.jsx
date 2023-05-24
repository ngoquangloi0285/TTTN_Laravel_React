import React, { useEffect, useRef, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { setNumber, setPage, setProduct } from '../../globalState';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const fetchData = async (slug, newProduct, suggestion, saleProduct, setProductList, setCategoryMap, setIsLoading) => {
    setIsLoading(true);
    try {
        const [productResponse, categoryResponse] = await Promise.all([
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
            axios.get('/api/category/v1/category')
        ]);

        const newCategoryMap = {};
        categoryResponse.data.forEach((category) => {
            newCategoryMap[category.id] = category.name_category;
        });
        setProductList(productResponse.data);
        setCategoryMap(newCategoryMap);
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
    const { slug } = useParams(); // lấy ID từ URL
    console.log("slug", slug)
    const newProduct = props.newProduct
    const saleProduct = props.saleProduct
    console.log(saleProduct)
    const suggestion = props.suggestion
    console.log(suggestion)
    const { grid } = props;
    let location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const fetchDataRef = useRef(null);

    useEffect(() => {
        fetchDataRef.current = fetchData;
    }, []);

    useEffect(() => {
        const { current: fetchData } = fetchDataRef;
        if (!fetchData) return;

        fetchData(slug, newProduct, suggestion, saleProduct, setProductList, setCategoryMap, setIsLoading);
    }, [slug, newProduct, suggestion, saleProduct]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setIsLoading(true);
    //         try {
    //             const [productResponse, categoryResponse] = await Promise.all([
    //                 axios.get('/api/product/v1/products', {
    //                     params: {
    //                         newProduct: newProduct,
    //                         saleProduct: saleProduct,
    //                         slug: slug,
    //                         suggestion: suggestion,
    //                     },
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 }),
    //                 axios.get('/api/category/v1/category')
    //             ]);

    //             const newCategoryMap = {};
    //             categoryResponse.data.forEach((category) => {
    //                 newCategoryMap[category.id] = category.name_category;
    //             });
    //             setProductList(productResponse.data);
    //             setCategoryMap(newCategoryMap);

    //             const product = productResponse.data;
    //             setProduct(product);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.log(error);
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [slug, newProduct, suggestion, saleProduct]);

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
                            <div key={product.id} className={` ${location.pathname === '/store' ? `gr-${grid}` : "col-3"} `}>
                                <Link className="product-card position-relative shadow ">
                                    <div className='discount position-absolute'>
                                        <span>{product.discount === null ? "" : `down ${parseInt(product.discount)}%`}</span>
                                    </div>
                                    <div className='discount position-absolute'>
                                        <span>{product.type === 'new_product' ? 'New Product' : ''}</span>
                                    </div>
                                    {/* <div className="wishlist-icon position-absolute">
                                        <Link>
                                            <img src="images/wish.svg" alt="wishlist"
                                            />
                                        </Link>
                                    </div> */}
                                    <div className="product-image">
                                        <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                        {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                                    </div>
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
                                    {/* <div className="action-bar position-absolute">
                                        <div className="d-flex flex-column gap-15">
                                            <Link to='/about'><img src="images/prodcompare.svg" alt="add-cart" /></Link>
                                            <Link to='/contact'><img src="images/add-cart.svg" alt="add-cart" /></Link>
                                            <Link to='/blog'><img src="images/view.svg" alt="add-cart" /></Link>
                                        </div>
                                    </div> */}
                                    <button
                                        className="add-to-cart"
                                    >
                                        Add to cart
                                    </button>
                                </Link>
                            </div>

                        ))
                    )
            }
        </>
    )
}

