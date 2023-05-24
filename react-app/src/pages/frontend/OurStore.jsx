import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta';
import { ProductList } from '../../components/frontend/ProductCard';
import Color from '../../components/frontend/Color';
import { getProduct } from '../../globalState';
import axios from '../../api/axios';
import RandomProduct from '../../components/frontend/RandomProduct';

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
    console.log(slug);
    let location = useLocation();
    const [grid, setGird] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse, categoryResponse, brandResponse] = await Promise.all([
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
                    axios.get('/api/category/v1/category'),
                    axios.get('/api/brand/v1/brand'),
                ]);

                const newCategoryMap = {};
                categoryResponse.data.forEach((category) => {
                    newCategoryMap[category.id] = category.name_category;
                });
                setProductList(productResponse.data);
                setBrandList(brandResponse.data)
                setCategoryMap(newCategoryMap);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [keyword, filter, slug]);

    const product_List = productList;
    const types = [...new Set(product_List.map(product => product.color))];
    const inch = [...new Set(product_List.map(product => product.inch))];
    console.log("type", inch)
    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = productList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(productList.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    return (
        <>
            <Meta title={"Our Store"} />
            <Maps title="Our Store" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-3">
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Shop By Brand
                                </h3>
                                <div className='container'>
                                    <div className="row filter-mx">
                                        <div className="col-3">
                                            <ul className="ps-2">
                                                {
                                                    isLoading ? (
                                                        <h1>Loading...</h1>
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
                                    Colors
                                </h3>
                                <div className="d-flex flex-wrap">
                                    <div>
                                        <Color color={types} />
                                    </div>
                                </div>
                                <h3 className="filter-title">
                                    Inch
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
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">
                                    Random Product
                                </h3>
                                <div>
                                    <RandomProduct random='random' />
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="filter-sort-gird mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-10">
                                        <p className='mb-0 title-sort d-block'>Sort By:</p>
                                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' name="" id="">
                                            <option value="" selected>Select Filter</option>
                                            <option value="bestSelling">Best Selling</option>
                                            <option value="lowToHigh">Price, low to high</option>
                                            <option value="highToLow">Price, high to low</option>
                                            <option value="oldToNew">Date, old to new</option>
                                            <option value="newToOld">Date, new to old</option>
                                        </select>
                                    </div>
                                    <div className="d-flex align-items-center gap-10">
                                        {/* <p className='m-0 totalproducts'><strong>{countProduct ? countProduct : 0} Products</strong></p> */}
                                        {/* <div className="d-flex align-items-center gap-10 gird">
                                            <img onClick={() => {
                                                setGird(3)
                                            }}
                                                className='d-block img-fluid' src="images/gr4.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(4)
                                            }}
                                                className='d-block img-fluid' src="images/gr3.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(6)
                                            }}
                                                className='d-block img-fluid' src="images/gr2.svg" alt="gird" />
                                            <img onClick={() => {
                                                setGird(12)
                                            }}
                                                className='d-block img-fluid' src="images/gr.svg" alt="gird" />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="products-list pd-5">
                                <div className="d-flex flex-wrap gap-10">
                                    {/* <ProductList grid={grid} /> */}
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
                                        ) :
                                            (
                                                records.map((product) => (
                                                    <div key={product.id} className='gr-4'>
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
                                    {
                                        productList.length === 0 && <h1>No products!</h1>
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