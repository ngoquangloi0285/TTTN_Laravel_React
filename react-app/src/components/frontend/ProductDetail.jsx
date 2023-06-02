import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductList } from './ProductCard';
import axios from '../../api/axios';
import ReactStars from "react-rating-stars-component";
import { Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseCart, getTotals } from '../../state/cartSlice';
import useAuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const ProductDetail = (props) => {
    const { currentUser } = useAuthContext();

    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    // const related_products = props.
    const { slug } = useParams();
    console.log('product detail', slug);
    const [productList, setProductList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [imagesMap, setImageMap] = useState([]);
    const [brandMap, setBrandMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isProductListLoaded, setIsProductListLoaded] = useState(false); // Thêm state mới

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse, categoryResponse, brandResponse] = await Promise.all([
                    axios.get(`/api/product/v1/product/`, {
                        params: {
                            slug: slug,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
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
                setIsProductListLoaded(true); // Cập nhật trạng thái đã tải xong productList
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (isProductListLoaded) {
            var parentImg = document.getElementById("parentImg");
            var childrenImg = document.getElementsByClassName('children-img');
            var intervalId;

            function changeImage(index) {
                parentImg.src = childrenImg[index].src;
            }

            function stopAutoChange() {
                clearInterval(intervalId);
            }

            for (var i = 0; i < childrenImg.length; i++) {
                childrenImg[i].addEventListener('mouseover', function () {
                    var hoveredIndex = Array.prototype.indexOf.call(childrenImg, this);
                    changeImage(hoveredIndex);
                    stopAutoChange();
                });
            }
        }
    }, [isProductListLoaded]);
    // addToCart
    const dispatch = useDispatch();
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        if (productList && productList.color) {
            setSelectedColor(productList.color);
        }
    }, [productList]);

    console.log('product color', selectedColor);


    const cart = useSelector((state) => state.cart);

    const handleAddToCart = (product, selectedColor) => {
        if (currentUser) {
            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingProduct = cart.cartItems.find(item => item.id === product.id);

            if (existingProduct) {
                // Kiểm tra màu sản phẩm có khác với sản phẩm trong giỏ hàng không
                if (existingProduct.color.toLowerCase() !== selectedColor.toLowerCase()) {
                    toast.info("Vui lòng đặt thành 2 đơn hàng với màu khác nhau");
                }
                else {
                    // Màu sản phẩm trùng khớp, tăng số lượng sản phẩm trong giỏ hàng
                    dispatch(addToCart(existingProduct));
                }
            } else {
                // Sản phẩm chưa tồn tại trong giỏ hàng, thêm vào giỏ hàng
                dispatch(addToCart({ product, selectedColor }));
            }
        } else {
            toast.error("Vui lòng đăng nhập");
        }
    };


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
                    <div div className="single-product store-wrapper home-wrapper-2 py-5">
                        <div className="container-xxl">
                            <div className="row">
                                <div className="col-4">
                                    <img id="parentImg" src={`http://localhost:8000/storage/product/${productList.image}`} alt={productList.name_product} />
                                    <div className="small-img-row">
                                        {
                                            productList.images.map((product) => (
                                                <div style={{ cursor: 'pointer' }} className="small-img-col">
                                                    <img className='children-img' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.image} width="100%" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h1>{productList.name_product}</h1>
                                    <p className='price'>${calculateDiscountedPrice(productList.price, productList.discount)} <span className='text-danger fs-6'><del>{productList.discount === null ? '' : `$ ${productList.price}`}</del> <sup>{productList.discount === null ? "" : `Giảm ${parseInt(productList.discount)}%`}</sup></span></p>
                                    <p className="text-dark m-0">
                                        Danh mục: <strong className='text-danger'> {categoryMap[productList.category_id]}</strong>
                                    </p>
                                    <p className="text-dark my-2">
                                        Thương hiệu: <strong className='text-danger'> {brandMap[productList.brand_id]}</strong>
                                    </p>
                                    <p className="text-dark my-2">
                                        Màu: <strong className='text-danger'> {productList.color}</strong>
                                    </p>
                                    <p className="text-dark my-2">
                                        Kích thước: <strong className='text-danger'> {productList.inch}</strong>
                                    </p>
                                    <label htmlFor="selectedColor">Chọn màu sản phẩm:</label>
                                    <input
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        style={{ width: '150px' }}
                                        type="text"
                                        id="selectedColor"
                                        className="form-control"
                                    />                                    <ReactStars
                                        count={5}
                                        onChange={ratingChanged}
                                        size={24}
                                        value="4"
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                    <input type="number" value='1' />
                                    <Link to="#" onClick={() => handleAddToCart(productList, selectedColor)} className='button btn-product-detail'>Add to cart</Link>
                                    <h3>Thông tin sản phẩm <i className='fa fa-indent'></i></h3>
                                    <p>
                                        <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productList.detail) }} />
                                    </p>
                                </div>
                                <hr style={{
                                    border: '1px solid #FF523b'
                                }} />
                                <div className="col-12">
                                    <div className="col-12">
                                        <h3 className="section-heading">Sản phẩm liên quan</h3>
                                    </div>
                                    <div className="store-wrapper home-wrapper-2 py-5">
                                        <div className="container-xxl">
                                            <div className="row">
                                                <ProductList relatedproducts="related_products" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    )
}

export default ProductDetail