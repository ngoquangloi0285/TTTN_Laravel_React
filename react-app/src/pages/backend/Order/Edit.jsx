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
import '../../frontend/your_order.css'
import { OrderQRCode } from '../QRCode/OrderQRCode';

const Edit = () => {
    const { currentUser } = useAuthContext();
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);
    const [status, setStatus] = useState(null);

    const [deliveryTime, setDeliveryTime] = useState();
    const [noteAdmin, setNoteAdmin] = useState('Cảm ơn đơn hàng của bạn!');

    const [orders, setOrders] = useState([]);

    const fetchOrderData = useCallback(async () => {
        try {
            const orderResponse = await axios.get(`api/order/v1/edit/${encodedId}`);
            if (orderResponse.data) {
                setOrders(orderResponse.data);
                // console.log(orderResponse.data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }, [encodedId]);

    useEffect(() => {
        fetchOrderData();
    }, [encodedId, fetchOrderData]);


    const handleStatusUpdate = useCallback(async (status) => {
        // Cập nhật trạng thái đơn hàng tại đây
        const newErrors = {};
        if (!deliveryTime) {
            newErrors.deliveryTime = "Vui lòng nhập ngày dự kiến giao hàng!";
        }
        // Kiểm tra các giá trị khác và thêm thông báo lỗi tương ứng vào object `newErrors`
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('status', status)
        formData.append('deliveryTime', deliveryTime)
        formData.append('note_admin', noteAdmin ? noteAdmin : null);
        try {
            const response = await axios.post(`/api/order/v1/update-order/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật đơn hàng',
                    text: response.data.status,
                    confirmButtonText: 'Trở đến lịch sử đơn hàng'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../order/history-order')
                    }
                });
                fetchOrderData();
            }
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setStatus(error.response.data.status);
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật không thành công',
                    text: error.response.data.error,
                });
            } else {
                // Xử lý các trường hợp lỗi khác
            }
            setIsLoading(false);
        }
    }, [deliveryTime, encodedId, noteAdmin, fetchOrderData, navigate]);

    const confirmUpdate = useCallback((status) => {
        Swal.fire({
            title: 'Bạn có chắc chắn',
            text: 'Bạn đang cập nhật trạng thái đơn hàng!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, Cập nhật!',
            cancelButtonText: 'Không, Không cập nhật!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleStatusUpdate(status)
            }
        });
    }, [handleStatusUpdate]);

    const handleCancleOrder = useCallback(async (id) => {
        try {
            const response = await axios.delete(`/api/order/v1/destroy/${encodedId}`);
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire({
                    icon: 'warning',
                    title: 'Hủy đơn hàng tạm thời',
                    text: response.data.message,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../order')
                    }
                });
            }
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setStatus(error.response.data.status);
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật không thành công',
                    text: error.response.data.error,
                });
            } else {
                // Xử lý các trường hợp lỗi khác
            }
            setIsLoading(false);
        }
    }, [encodedId, navigate]);

    const confirmCancleOrder = useCallback((status) => {
        Swal.fire({
            title: 'Bạn có chắc chắn',
            text: 'Bạn có chắn chắn hủy đơn hàng này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, Có hủy đơn!',
            cancelButtonText: 'Không, Không hủy đơn!'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true); // Đặt trạng thái isLoading thành true
                handleCancleOrder(status)
                    .then(() => {
                        setIsLoading(false); // Đặt trạng thái isLoading thành false khi xử lý hoàn tất
                    })
                    .catch(() => {
                        setIsLoading(false); // Đặt trạng thái isLoading thành false khi có lỗi xảy ra
                    });
            }
        });
    }, [handleCancleOrder]);

    useEffect(() => {
        if (status || error) {
            setTimeout(() => {
                setStatus(null);
                setError(null);
            }, 5000);
        }
    }, [status, error]);

    if (isLoading === true) {
        return <>
            <div className='d-flex justify-content-center fs-5'>Đang xử lý...</div>
        </>
    }

    return (
        <>
            <Meta title={`Cập nhật trạng thái đơn hàng có mã: ${encodedId}`} />
            <div className="row">
                <div className="col-12">
                    <div className="card-body  p-4">
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
                <div className='col-12'>
                    <div className='card-body edit_your_order px-4 py-0'>
                        <div className='text-center'><h1>Thông tin khách hàng</h1></div>
                        <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                        <div className="d-flex justify-content-around">
                            <div className='mx-2'>
                                <label htmlFor="name">Tên khách hàng:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.orderer_name} />
                            </div>
                            <div className='mx-2'>
                                <label htmlFor="name">Email:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.email_order} />
                            </div>
                            <div className='mx-2'>
                                <label htmlFor="name">Số điện thoại:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.phone_order} />
                            </div>
                            <div className='mx-2'>
                                <label htmlFor="name">Địa chỉ giao hàng:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.address_order} />
                            </div>
                            <div className='mx-2'>
                                <label htmlFor="name">Thành Phố:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.city} />
                            </div>
                            <div className='mx-2'>
                                <label htmlFor="name">Mã bưu điện:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.zip_code} />
                            </div>

                        </div>
                        <div className="my-3">
                            <div className='mx-2'>
                                <label htmlFor="name">Lời nhắn của khách hàng:</label>
                                <textarea type="text" className='form-control text-danger' disabled value={orders.note} />
                            </div>
                        </div>
                    </div>
                    {/* Tạo mã QR từ thông tin đơn hàng */}
                    <div className='text-center'><h1>QR Code</h1></div>
                    <div className='d-flex justify-content-center'>
                        <OrderQRCode order={orders} />
                    </div>
                    <hr className="mt-4" style={{ backgroundColor: '#000', opacity: 1 }} />
                </div>
                <div className='col-12'>
                    <div className="card-body edit_your_order p-4">
                        <div className='text-center'><h1>Thông tin đơn hàng</h1></div>
                        <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}>Biên lai</p>
                            <p className="fs-5 text-muted mb-0"><strong>Phiếu nhận hàng: {orders.id}</strong></p>
                        </div>
                        <div className="card shadow-0 border mb-4">
                            {orders.orderDetails &&
                                // Thực hiện nếu có dữ liệu
                                orders.orderDetails.map((detail) => (
                                    <div className="card-body">
                                        {/* Các phần tử bên trong */}
                                        <div className="card-body">
                                            <div className="row" key={detail.id}>
                                                <div className="col-md-2">
                                                    <img
                                                        src={`http://localhost:8000/storage/product/${detail.image}`}
                                                        className="img-fluid" alt="Phone" />
                                                </div>
                                                <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p className="text-muted mb-0">{detail.product_name}</p>
                                                </div>
                                                <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p className="text-muted mb-0">{detail.color}</p>
                                                </div>
                                                <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p className="text-muted mb-0">Số lượng: {detail.quantity}</p>
                                                </div>
                                                <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p className="text-muted mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}</p>
                                                </div>
                                                <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p className="text-muted mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.total_amount)}</p>
                                                </div>
                                            </div>

                                            <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                                        </div>
                                    </div>
                                ))
                            }
                            {/* Tạo mã QR từ thông tin đơn hàng */}
                            <div className='text-center'><h1>QR Code</h1></div>
                            <div className='d-flex justify-content-center'>
                                <OrderQRCode order={orders.orderDetails} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between pt-2">
                            <p className="fw-bold mb-0">Chi tiết đơn hàng</p>
                            <p className="text-muted mb-0">
                                <span className="fw-bold me-4">Tổng cộng</span>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orders.total_amount)}
                            </p>
                        </div>
                        <div className="d-flex justify-content-between mb-5">
                            <p className="text-muted my-2"><span className="fw-bold me-4">Chi phí vận chuyển</span> Miễn phí</p>
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='card-body edit_your_order px-4 py-0'>
                        <div className='text-center'><h1>Trạng thái đơn hàng</h1></div>
                        <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                        <h6 className='mt-3'><i>Mã đơn hàng</i>: <strong>{orders.id}</strong></h6>
                        <div className="row mt-3">
                            <div className="col-4 m-0">
                                <label htmlFor="deliveryTime"><strong>Ngày dự kiến giao đơn: </strong>
                                    <input className='form-control' value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} type="date" />
                                </label>
                                {errors.deliveryTime && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.deliveryTime}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-4 m-0">
                                <label htmlFor="deliveryTime"><strong>Bạn có lời nhắn cho khách hàng không?: </strong>
                                    <textarea value={noteAdmin} onChange={(e) => setNoteAdmin(e.target.value)} className='form-control' type="text" />
                                </label>
                            </div>
                            {errors.noteAdmin && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.noteAdmin}
                                </div>
                            )}
                        </div>
                        <div className="track">
                            <div className={`step ${orders.status > 0 ? "active" : ""}`}>
                                <span className="icon" onClick={() => confirmUpdate(1)} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-check" />
                                </span>
                                <span className="text">
                                    {orders.status === 0 ? "Đang đợi xác nhận đơn hàng..." : "Đã xác nhận đơn hàng"}
                                </span>
                            </div>
                            <div className={`step ${orders.status > 1 ? "active" : ""}`} >
                                <span className="icon" onClick={() => confirmUpdate(2)} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-user" />
                                </span>
                                <span className="text">
                                    {orders.status <= 1 ? "Đang đợi đóng hàng..." : "Đã đóng hàng"}
                                </span>
                            </div>
                            <div className={`step ${orders.status > 2 ? "active" : ""}`}>
                                <span className="icon" onClick={() => confirmUpdate(3)} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-truck" />
                                </span>
                                <span className="text">
                                    {orders.status <= 2 ? "Đang đợi giao đơn cho nhà vận chuyển..." : "Đang vận chuyển"}
                                </span>
                            </div>
                            <div className={`step ${orders.status > 3 ? "active" : ""}`}>
                                <span className="icon" onClick={() => confirmUpdate(4)} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-box" />
                                </span>
                                <span className="text">
                                    {orders.status <= 3 ? "Chưa giao đến..." : "Đã giao"}
                                </span>
                            </div>
                        </div>
                        <br />
                        {isLoading && <div className='d-flex justify-content-center fs-5'>Đang xử lý...</div>}
                        <br />
                        <div className="d-flex justify-content-center align-items-center">
                            <div className='mx-2'>
                                <button
                                    onClick={() => confirmCancleOrder(orders.id)}
                                    className='btn bg-danger text-white'>Hủy đơn hàng</button>
                            </div>
                            <div className='mx-2'>
                                <Link to="../order" className="btn btn-info text-white mr-2" type="button">
                                    <AiOutlineRollback className='fs-4' />
                                    Quay về danh sách đơn hàng
                                </Link>
                            </div>
                        </div>
                        <hr className="mt-4" style={{ backgroundColor: '#000', opacity: 1 }} />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Edit;
