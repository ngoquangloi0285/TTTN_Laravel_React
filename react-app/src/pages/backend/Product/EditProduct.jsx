import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from '../../../api/axios';
const EditProduct = () => {
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const [product, setProduct] = useState({});

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`/api/product/v1/products/${encodedId}`);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        getProduct();
    }, [id]);
    console.log('edit product', product);
    // ...the rest of your code to render the EditProduct component
    return (
        <div>
            <h1>Edit Product</h1>
        </div>
    )
}

export default EditProduct