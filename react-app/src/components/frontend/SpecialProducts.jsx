import React, { useEffect, useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

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
                    axios.get('/api/product/v1/products', {
                        params: {
                            product_special: special
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
                                src="" className="card-img-top placeholder-glow placeholder" alt="" />
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
                            <div className='col-6 mb-4'>
                                <div className="special-product-card shadow position-relative">
                                    <div className="d-flex justify-content-around ">
                                        <div className='discount-special position-absolute'>
                                            <span>{product.discount === null ? "" : `down ${parseInt(product.discount)}%`}</span>
                                        </div>
                                        <div className='special-right position-absolute'>
                                            <span>Sản phẩm đặt biệt</span>
                                        </div>
                                        <div className='px-5'>
                                            <Link to={`../product-detail/${product.slug}`}>
                                                <img
                                                    className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                            </Link>
                                        </div>
                                        <div className="special-product-content">
                                            <h5 className='bran'>{categoryMap[product.category_id]}</h5>
                                            <h6 className='title mt-2'>
                                                {product.name_product}
                                            </h6>
                                            <p className="text-danger brand m-0">
                                                {brandMap[product.brand_id]}
                                            </p>
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={4}
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                            <p className="price"><span className='red-p'>${calculateDiscountedPrice(product.price, product.discount)}</span> &nbsp; <strike>{product.discount === null ? '' : `$ ${product.price}`}</strike> </p>
                                            <div className="discount-till d-flex align-items-center">
                                                {/* <div className="d-flex gap-10 align-items-center">
                                                    <span className='badge rounded-circle circle-day bg-danger'>12</span>:
                                                    <span className='badge rounded-circle circle-day bg-danger'>00</span>:
                                                    <span className='badge rounded-circle circle-day bg-danger'>00</span>
                                                </div> */}
                                            </div>
                                            <div className="">
                                                <Link to={`../product-detail/${product.slug}`} className='btn bg-primary text-white my-2'>
                                                    Xem thông tin sản phẩm
                                                </Link>
                                            </div>
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