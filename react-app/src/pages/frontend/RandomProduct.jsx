import React, { useEffect, useState } from 'react'
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const RandomProduct = ({ random_product }) => {
    console.log(random_product)
    const [isLoading, setIsLoading] = useState(true);
    const [randomProduct, setRandomProduct] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [brandMap, setBrandMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productResponse, categoryResponse, brandResponse] = await Promise.all([
                    axios.get('/api/product/v1/get_data', {
                        params: {
                            random_product: random_product
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
                setRandomProduct(productResponse.data);
                setCategoryMap(newCategoryMap);
                setBrandMap(newBrandMap);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        setIsLoading(false);
    }, [random_product]);

    return (
        <>
            {
                isLoading ? (
                    <div className="row">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {randomProduct.map((product, index) => (
                            <div className="gr-4 random-card">
                                <Link to={`../product-detail/${product.slug}`}>
                                    <div key={index} className="d-flex flex-wrap justify-content-between align-items-center gap-10">
                                        <img className='img-fluid' src={`http://localhost:8000/storage/product/${product.image}`} alt={product.name_product} />
                                        <div className="small-banner-content position-absolute">
                                            <h4>Trả góp 0%</h4>
                                            <h5>{product.name_product}</h5>
                                            <p>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                )
            }

        </>
    )
}

export default RandomProduct