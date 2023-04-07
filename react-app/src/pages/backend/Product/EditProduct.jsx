import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { IoCreateOutline } from 'react-icons/io5';
import Edit from './Edit';

const EditProduct = () => {
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const [product, setProduct] = useState({});

    const getProduct = async () => {
        try {
            const response = await axios.get(`/api/product/v1/products/${encodedId}`);
            setProduct(response.data);
            console.log(product)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (encodedId) {
            getProduct();
        }
    }, [encodedId]);

    // Gọi component Edit và truyền biến product vào props
    return (
        <>
            <div className='d-flex my-3 align-items-center justify-content-center'>
                <h1 className='text-white'>Edit product with ID: {encodedId}</h1>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-warning btn-edit mx-2 d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#editProduct" aria-expanded="false" aria-controls="collapseWidthExample">
                            <IoCreateOutline className='fs-4' /> Edit Product
                        </button>
                    </div>
                </div>
                <Link
                    className='link-edit'
                    to='../product'>Back Product</Link>
            </div>
            <div className='position-relative'>
                <div className="collapse edit-product position-absolute z-2" id="editProduct">
                    <div className="card card-body "
                        style={
                            {
                                minWidth: '1400px',
                                minHeight: '600px',
                            }
                        }>
                        <div className="p-2 text-dark">
                            <Edit product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default EditProduct