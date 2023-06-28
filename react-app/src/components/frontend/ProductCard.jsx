import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { FaStar } from 'react-icons/fa';
import { FaStarHalf } from 'react-icons/fa';
import moment from 'moment';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import Marquee from 'react-fast-marquee';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

export const ProductList = ({ relatedproducts, newProduct, saleProduct, suggestion }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const updateLocalStorageCounterRef = useRef(0);

    const fetchDataAndUpdateLocalStorage = useCallback(async (newProduct, suggestion, saleProduct, relatedproducts) => {
        try {
            const response = await axios.get('/api/product/v1/get_data', {
                params: {
                    newProduct: newProduct,
                    saleProduct: saleProduct,
                    suggestion: suggestion,
                    relatedproducts: relatedproducts
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setProductList(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDataAndUpdateLocalStorage(newProduct, suggestion, saleProduct, relatedproducts);
    }, [newProduct, suggestion, saleProduct, relatedproducts, fetchDataAndUpdateLocalStorage]);

    useEffect(() => {
        const updateLocalStorage = () => {
            updateLocalStorageCounterRef.current++;

            if (updateLocalStorageCounterRef.current >= 3) {
                localStorage.setItem('productList', JSON.stringify(productList));
                updateLocalStorageCounterRef.current = 0;
            }
        };

        updateLocalStorage();
    }, [productList]);

    useEffect(() => {
        const timer = setInterval(() => {
            fetchDataAndUpdateLocalStorage(newProduct, suggestion, saleProduct, relatedproducts);
        }, 600000); // Fetch data every 10 minutes

        return () => clearInterval(timer);
    }, [newProduct, suggestion, saleProduct, relatedproducts, fetchDataAndUpdateLocalStorage]);

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
                                            {product.category_name}
                                        </p>
                                        <p className="text-danger brand m-0">
                                            {product.brand_name}
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
        </>
    )
}

export const SpecialProducts = ({ special }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const updateLocalStorageCounterRef = useRef(0);

    const fetchDataAndUpdateLocalStorage = useCallback(async (special) => {
        try {
            const productResponse = await axios.get('/api/product/v1/get_data', {
                params: {
                    specialProduct: special
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDataAndUpdateLocalStorage(special);
    }, [special, fetchDataAndUpdateLocalStorage]);

    useEffect(() => {
        const updateLocalStorage = () => {
            updateLocalStorageCounterRef.current++;

            if (updateLocalStorageCounterRef.current >= 3) {
                localStorage.setItem('specialProducts', JSON.stringify(productList));
                updateLocalStorageCounterRef.current = 0;
            }
        };

        updateLocalStorage();
    }, [productList]);


    useEffect(() => {
        const timer = setInterval(() => {
            fetchDataAndUpdateLocalStorage(special);
        }, 600000); // Fetch data every 10 minutes

        return () => clearInterval(timer);
    }, [special, fetchDataAndUpdateLocalStorage]);

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
                                            <h5 className='bran'>{product.category_name}</h5>
                                            <p className="text-danger brand m-0">
                                                {product.brand_name}
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

export const SlideShow = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [slideList, setSlideList] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const updateLocalStorageCounterRef = useRef(0);

    const fetchDataAndUpdateLocalStorage = useCallback(async () => {
        try {
            const slideResponse = await axios.get('/api/product/v1/show_slide');
            const updatedProductList = slideResponse.data
            setSlideList(updatedProductList);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDataAndUpdateLocalStorage();
    }, [fetchDataAndUpdateLocalStorage]);

    // useEffect(() => {
    //     const updateLocalStorage = () => {
    //         updateLocalStorageCounterRef.current++;

    //         if (updateLocalStorageCounterRef.current >= 3) {
    //             localStorage.setItem('slideShow', JSON.stringify(slideList));
    //             updateLocalStorageCounterRef.current = 0;
    //         }
    //     };

    //     updateLocalStorage();
    // }, [slideList]);


    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         fetchDataAndUpdateLocalStorage();
    //     }, 600000); // Fetch data every 10 minutes

    //     return () => clearInterval(timer);
    // }, [fetchDataAndUpdateLocalStorage]);

    const goToPrevSlide = () => {
        setActiveSlide((prevSlide) => (prevSlide === 0 ? slideList.length - 1 : prevSlide - 1));
    };

    const goToNextSlide = useCallback(() => {
        setActiveSlide((prevSlide) => (prevSlide === slideList.length - 1 ? 0 : prevSlide + 1));
    }, [slideList.length]);

    useEffect(() => {
        const timer = setTimeout(goToNextSlide, 7000);
        return () => clearTimeout(timer);
    }, [activeSlide, goToNextSlide]);

    const slideOne = slideList[0];

    return (
        <>
            <div className="slide-container">
                <button id="btn-slide1" onClick={goToPrevSlide}>
                    <AiOutlineDoubleLeft />
                </button>
                <div className="slide">
                    {isLoading ? (
                        <p className='text-center'>Loading....</p>
                    ) : (
                        slideList.map((slide, index) => (
                            <img
                                key={slide.id}
                                src={`http://localhost:8000/storage/product/${slide.image}`}
                                alt={`Slide ${index + 1}`}
                                className={`d-${index === activeSlide ? 'block' : 'none'} transition-slide`}
                            />
                        ))
                    )}
                </div>
                <div className="main-banner-content position-absolute">
                    <h3 style={{ color: '#eb1834' }}>
                        {slideOne?.price &&
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(slideOne?.price)
                        }
                    </h3>
                    <h4>Trả góp 0%.</h4>
                    <h5 className="text-primary">{slideOne?.name_product}</h5>
                    <Link to={`../product-detail/${slideOne?.slug_product}`} className="button">Mua ngay bây giờ</Link>
                </div>
                <button id="btn-slide2" onClick={goToNextSlide}>
                    <AiOutlineDoubleRight />
                </button>
            </div>
        </>
    )
}

// export const RandomProduct = ({ random_product }) => {

//     const [isLoading, setIsLoading] = useState(true);
//     const [randomProduct, setRandomProduct] = useState([]);
//     const updateLocalStorageCounterRef = useRef(0);

//     const fetchDataAndUpdateLocalStorage = useCallback(async () => {
//         try {
//             const [productResponse] = await Promise.all([
//                 axios.get('/api/product/v1/get_data', {
//                     params: {
//                         random_product: random_product
//                     },
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }),
//             ]);
//             const updatedProductList = productResponse.data
//             setRandomProduct(updatedProductList)
//             setIsLoading(false);

//         } catch (error) {
//             console.log(error);
//         }
//     }, [random_product]);

//     useEffect(() => {
//         fetchDataAndUpdateLocalStorage();
//     }, [fetchDataAndUpdateLocalStorage]);

//     // useEffect(() => {
//     //     const updateLocalStorage = () => {
//     //         updateLocalStorageCounterRef.current++;
//     //         if (updateLocalStorageCounterRef.current >= 3) {
//     //             localStorage.setItem('randomProduct', JSON.stringify(randomProduct));
//     //             updateLocalStorageCounterRef.current = 0;
//     //         }
//     //     };
//     //     updateLocalStorage();
//     // }, [randomProduct]);

//     // useEffect(() => {
//     //     const timer = setInterval(() => {
//     //         fetchDataAndUpdateLocalStorage();
//     //     }, 600000); // Fetch data every 10 minutes

//     //     return () => clearInterval(timer);
//     // }, [fetchDataAndUpdateLocalStorage]);


//     return (
//         <>
//             {
//                 isLoading ? (
//                     <div className="row">
//                         <p>Loading...</p>
//                     </div>
//                 ) : (
//                     <>
//                         {randomProduct.map((product, index) => (
//                             <div className="gr-4 random-card">
//                                 <Link to={`../product-detail/${product.slug}`}>
//                                     <div key={index} className="d-flex flex-wrap justify-content-between align-items-center gap-10">
//                                         <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
//                                         <div className="small-banner-content position-absolute">
//                                             <h4>Trả góp 0%</h4>
//                                             <h5>{product.name_product}</h5>
//                                             <p>
//                                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </Link>
//                             </div>
//                         ))}
//                     </>
//                 )
//             }

//         </>
//     )
// }

export const BrandList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [brandList, setBrandList] = useState([]);
    const updateLocalStorageCounterRef = useRef(0);

    const fetchDataAndUpdateLocalStorage = useCallback(async () => {
        try {
            const brandResponse = await axios.get("/api/brand/v1/brand");
            const updatedProductList = brandResponse.data
            setBrandList(updatedProductList);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchDataAndUpdateLocalStorage();
    }, [fetchDataAndUpdateLocalStorage]);

    // useEffect(() => {
    //     const updateLocalStorage = () => {
    //         updateLocalStorageCounterRef.current++;

    //         if (updateLocalStorageCounterRef.current >= 3) {
    //             localStorage.setItem('brandList', JSON.stringify(brandList));
    //             updateLocalStorageCounterRef.current = 0;
    //         }
    //     };

    //     updateLocalStorage();
    // }, [brandList]);


    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         fetchDataAndUpdateLocalStorage();
    //     }, 600000); // Fetch data every 10 minutes

    //     return () => clearInterval(timer);
    // }, [fetchDataAndUpdateLocalStorage]);

    return (
        <>
            <div className="col-12">
                <div className="marquee-inner-wrapper bg-white py-3 card-wrapper">
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
                                </div>
                            </div>
                        ) : (
                            <Marquee className="d-flex">
                                {
                                    brandList.map((brand) => (
                                        <div className="mx-4 w-25">
                                            <img
                                                style={
                                                    {
                                                        height: '100px'
                                                    }
                                                }
                                                className="img-fluid img-thumbnai" src={`http://localhost:8000/storage/brand/${brand.image}`} alt={brand.image} />
                                        </div>
                                    ))
                                }
                            </Marquee>
                        )
                    }
                </div>
            </div>
        </>
    )
}



