import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
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

    const { keyword, slug } = useParams();
    const [filter, setFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productResponse] = await Promise.all([
                axios.get('/api/product/v1/products', {
                    params: {
                        search: keyword,
                        filter: filter,
                        slug: slug,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            ]);
            setProductList(productResponse.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, [filter, slug, keyword]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = productList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(productList.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    return (
        <>
            <Meta title={"Cửa hàng E-Mart"} />
            <Maps title="Cửa hàng E-Mart" />
            <div className="store-wrapper home-wrapper-2 py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div class="banner-ourstore">
                                <div className='img-banner-left'>
                                    <img src="images/flash.png" alt="" width="100" />
                                </div>
                                <div className='img-banner-right'>
                                    <img src="images/aithy.jpg" alt="" width="100" />
                                </div>
                                <h2>Tha hồ mua sắm cùng E-Mart <img src="images/mua_ngay.png" alt="" width="100" /> </h2>
                                <h5>Siêu thị điện tử </h5>
                            </div>
                            <div className="filter-sort-gird mb-4">
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="d-flex align-items-center gap-10">
                                        <label className='mb-0 title-sort d-block'>Sắp xếp theo:</label>
                                        <div className="row">
                                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' style={{width: '200px'}} name="" id="">
                                                <option value="" selected>Chọn lọc</option>
                                                <option value="bestSelling">Bán chạy nhất</option>
                                                <option value="lowToHigh">Giá, thấp đến cao</option>
                                                <option value="highToLow">Giá, cao đến thấp</option>
                                                <option value="oldToNew">Ngày, củ đến mới</option>
                                                <option value="newToOld">Ngày, mới đến củ</option>
                                            </select>
                                        </div>
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
                                                    <div key={product.id} className='gr-f3'>
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
                                                                        {product.category_name}
                                                                    </p>
                                                                    <p className="text-danger brand m-0">
                                                                        {product.brand_name}
                                                                    </p>
                                                                    <h5 className='product-title'>
                                                                        {product.name_product}
                                                                    </h5>
                                                                    <p className="text-danger brand m-0">
                                                                        <span>
                                                                            Màu: <span className='text-dark'>{product.color}</span>
                                                                        </span>
                                                                        <span className='text-info'> - </span>
                                                                        <span>
                                                                            Kích thước: <span className='text-dark'>{product.inch}</span>
                                                                        </span>
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