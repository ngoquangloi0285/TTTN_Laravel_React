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
            console.log(response.data)
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
            <div className='my-3'>
                <h4 className='text-center'
                    style={
                        {
                            borderBottom: '1px solid #000'
                        }
                    }
                >Edit product with ID: {encodedId}</h4>
                {/* <div className="row">
                    <div className="col-12">
                        <button className="btn btn-warning btn-edit mx-2 d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#editProduct" aria-expanded="false" aria-controls="collapseWidthExample">
                            <IoCreateOutline className='fs-4' /> Edit Product
                        </button>
                    </div>
                </div> */}
                <Link
                    className='link-edit'
                    to='../product'>Back Product</Link>
                <Edit product={product} />
            </div>
            {/* <div className='position-relative'>
                <div className="collapse edit-product" id="editProduct">
                    <div className="card card-body "
                    >
                        <div className="p-2 text-dark">
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}


export default EditProduct