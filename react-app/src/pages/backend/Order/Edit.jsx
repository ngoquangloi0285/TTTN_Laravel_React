import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Toast, Container } from 'react-bootstrap';
import moment from 'moment-timezone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from '../../../context/AuthContext';
import LoadingOverlay from 'react-loading-overlay';
import { ImCancelCircle } from 'react-icons/im';
import { IoCreateOutline } from 'react-icons/io5';
import { AiOutlineClear, AiOutlineRollback } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Edit = () => {
    const { currentUser } = useAuthContext();
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);
    const [status, setStatus] = useState(null);

    const [order, setOrder] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get(`api/order/v1/edit/${encodedId}`),
        ])
            .then(([orderResponse]) => {
                if (orderResponse.data) {
                    setOrder(orderResponse.data);
                    console.log(orderResponse.data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });
    }, [encodedId]);

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = useCallback(async () => {
        const btn = document.getElementById('btn_create');
        // lấy dữ liệu thì form

        // chèn dữ liệu
        const formData = new FormData();

        try {
            btn.innerHTML = "Updating...";
            const response = await axios.post(`/api/product/v1/update-product/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Update Product";
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.status,
                    confirmButtonText: 'Back to Product'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../product')
                    }
                });
            }
        } catch (error) {
            setIsLoading(false);
            // Nếu xảy ra lỗi, hiển thị thông báo lỗi
            if (error.response.status === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Failed to create new Product.', 'error');
            }
            btn.innerHTML = "Update Product";
        }
    }, [encodedId, navigate]);

    // xác nhận  update
    const confirmUpdate = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to update Product this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit();
            }
        });
    }, [handleSubmit]);

    useEffect(() => {
        if (status || error) {
            setTimeout(() => {
                setStatus(null);
                setError(null);
            }, 5000);
        }
    }, [status, error]);

    if (isLoading === true) {
        return <LoadingOverlay className='text-danger'
            spinner
            active={isLoading}
            text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
            }
        ></LoadingOverlay>
    }
    return (
        <>
            <Meta title={`Update Product with ID: ${encodedId}`} />
            <div className="row">
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{currentUser?.name}</span></label>
                            </div>
                        </div>
                        <button onClick={confirmUpdate} className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                            <IoCreateOutline className='fs-4' />
                            Cập nhật trạng thái đơn hàng: <strong >{id}</strong>
                        </button>
                        <Link to="../order" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            Quay về danh sách đơn hàng
                        </Link>
                    </div>
                </div>
                <ToastContainer />
            </div>

        </>
    );
};

export default Edit;
