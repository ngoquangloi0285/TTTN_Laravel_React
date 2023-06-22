import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta';
import Color from '../../components/frontend/Color';
import axios from '../../api/axios';
import { FaStar, FaStarHalf } from 'react-icons/fa';

function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const OurStore = () => {

    const ratingChanged = (newRating) => {
        console.log(newRating);
    };

    const { keyword, slug } = useParams(); // lấy ID từ URL
    const [filter, setFilter] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [brandMap, setBrandMap] = useState({});

    const fetchCategory = useCallback(async () => {
        try {
            const categoryResponse = await axios.get('/api/category/v1/category');
            const newCategoryMap = {};
            categoryResponse.data.forEach((category) => {
                newCategoryMap[category.id] = category.name_category;
            });
            setCategoryMap(newCategoryMap);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productResponse, brandResponse] = await Promise.all([
                axios.get('/api/product/v1/products', {
                    params: {
                        search: keyword,
                        filter: filter,
                        slug: slug,
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                axios.get('/api/brand/v1/brand'),
            ]);

            const newBrandMap = {};
            brandResponse.data.forEach((brand) => {
                newBrandMap[brand.id] = brand.name;
            });

            setProductList(productResponse.data);
            setBrandList(brandResponse.data);
            setBrandMap(newBrandMap);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, [filter, slug, keyword]);

    useEffect(() => {
        Promise.all([fetchCategory(), fetchData()]);
    }, [fetchCategory, fetchData]);

    const product_List = productList;
    const types = [...new Set(product_List.map(product => product.color))];
    const inch = [...new Set(product_List.map(product => product.inch))];

    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = productList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(productList.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    return (
        <>
            <Meta title={"Cửa hàng E-Mart"} />
            <Maps title="Cửa hàng E-Mart" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-3">
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Thương hiệu
                                </h3>
                                <div className='container'>
                                    <div className="row filter-mx">
                                        <div className="col-3">
                                            <ul className="ps-2">
                                                {
                                                    isLoading ? (
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    ) : (
                                                        brandList.map((brand) => (
                                                            <li><Link to={`../brand-product/${brand.slug}`} key={brand.id} >{brand.name}</Link></li>
                                                        ))
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                     Màu sản phẩm
                                </h3>
                                <div className="d-flex flex-wrap">
                                    <div>
                                        <Color color={types} />
                                    </div>
                                </div>
                                <h3 className="filter-title">
                                    Kích thước sản phẩm
                                </h3>
                                {
                                    inch.map((inch) => (
                                        <div>
                                            <Link to={`../product/inch/${inch}`}>
                                                <p className='form-check-label' htmlFor={inch}>
                                                    {inch} inch
                                                </p>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="filter-sort-gird mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-10">
                                        <p className='mb-0 title-sort d-block'>Sắp xếp theo:</p>
                                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' name="" id="">
                                            <option value="" selected>Chọn lọc</option>
                                            {/* <option value="bestSelling">Bán chạy nhất</option> */}
                                            <option value="lowToHigh">Giá, thấp đến cao</option>
                                            <option value="highToLow">Giá, cao đến thấp</option>
                                            <option value="oldToNew">Ngày, củ đến mới</option>
                                            <option value="newToOld">Ngày, mới đến củ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="products-list pd-5">
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
                                                records.map((product) => (
                                                    <div key={product.id} className='gr-f4'>
                                                        <div className="product-card position-relative">
                                                            <div className='discount position-absolute'>
                                                                <span>{product.discount === null ? "" : `Giảm ${parseInt(product.discount)}%`}</span>
                                                            </div>
                                                            <div className='discount position-absolute'>
                                                                <span>{product.type === 'new_product' ? 'Sản phẩm mới' : ''}</span>
                                                            </div>
                                                            <Link to={`../product-detail/${product.slug}`} className='d-flex justify-content-center' >
                                                                <div className="product-image">
                                                                    <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} width="100%" alt={product.name_product} />
                                                                    {/* <img className='img-fluid' src="images/tab1.jpg" alt="" /> */}
                                                                </div>
                                                            </Link>

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
                                                                    <p className="text-danger brand m-0">
                                                                        Màu: <span className='text-dark'>{product.color}</span>
                                                                    </p>
                                                                    <div className="react_start d-flex">
                                                                        <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                                                        <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                                                        <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                                                        <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
                                                                        <FaStarHalf style={{ color: '#ffd700', fontSize: '20px' }} />
                                                                    </div>
                                                                    <p className="price">
                                                                        <strong>
                                                                            {calculateDiscountedPrice(product.price, product.discount).toLocaleString('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND'
                                                                            })}
                                                                        </strong> &nbsp;
                                                                        <span className="original-price">
                                                                            {product.discount === null ? '' : (
                                                                                <del>
                                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                                                </del>
                                                                            )}
                                                                        </span>
                                                                    </p>
                                                                    {/* <p className={`description ${grid === 12 ? "d-block" : "d-none"} `}>
                                                                        {product.summary}
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                            <Link to={`../product-detail/${product.slug}`}
                                                                className="add-to-cart"
                                                            >
                                                                Xem thông tin sản phẩm
                                                            </Link>
                                                        </div>

                                                    </div>

                                                ))
                                            )
                                    }
                                    {/* {
                                        productList.length === 0 && <p>Không có sản phẩm!</p>
                                    } */}
                                </div>
                            </div>
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a href="/" className="page-link" onClick={prePage}>
                                            <span aria-hidden="true">&laquo;</span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                    </li>
                                    {numbers.map((n, i) => (
                                        <li key={i} className={`page-item ${currentPage === n ? 'active' : ''}`}>
                                            <Link className="page-link" onClick={() => changePage(n)}>
                                                {n}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
                                        <a href="/" className="page-link" onClick={nextPage}>
                                            <span aria-hidden="true">&raquo;</span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    function prePage(event) {
        event.preventDefault();

        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    function changePage(id) {
        setCurrentPage(id);
    }
    function nextPage(event) {
        event.preventDefault();

        if (currentPage !== lastIndex) {
            setCurrentPage(currentPage + 1);
        }
    }
}

export default OurStore