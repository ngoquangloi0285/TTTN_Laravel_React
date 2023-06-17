import React, { useCallback, useEffect, useState } from 'react'
import Meta from '../../components/frontend/Meta'
import Maps from '../../components/frontend/Maps'
import useAuthContext from '../../context/AuthContext';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import RatingForm from './RatingForm';

const OrderHistory = () => {
    const { currentUser } = useAuthContext();
    const userID = currentUser?.id;
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const fetchOrderData = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`/api/order/v1/history/${userID}`);
            setOrders(response.data.orders);
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }, [userID]);

    useEffect(() => {
        fetchOrderData();
    }, [fetchOrderData]);
    return (
        <>
            <Meta title="Lịch sử đơn hàng" />
            <Maps title="Lịch sử đơn hàng" />
            <div className="container-xxl">
                <section className="h-100 gradient-custom your_order">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-lg-12 col-xl-12">
                                <div className="card" style={{ borderRadius: 10 }}>
                                    <h5 className="text-muted mb-0">Thông tin lịch sử đơn hàng của bạn, <span style={{ color: '#000' }}>{currentUser?.name}</span>!</h5>
                                    {
                                        isLoading ? <>
                                            <p>Đang tải lịch sử đơn hàng của bạn...</p>
                                        </>
                                            :
                                            <>
                                                <div className="card-body p-4">
                                                    {orders.length > 0 ? (
                                                        orders.map((order) => (
                                                            <div key={order.order.id}>
                                                                <p className='text-success'>Thông báo từ quản trị viên: {order.order.note_admin}</p>
                                                                <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                                    <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}>Biên lai</p>
                                                                    <p className="fs-5 text-muted mb-0"><strong>Phiếu nhận hàng: {order.order.id}</strong></p>
                                                                </div>
                                                                <div className="card shadow-0 border mb-4">
                                                                    {order.orderDetails.length > 0 ? (
                                                                        order.orderDetails.map((detail) => (
                                                                            <div className="card-body">
                                                                                <div className="row" key={detail.id}>
                                                                                    <div className="col-md-2">
                                                                                        <img
                                                                                            src={`http://localhost:8000/storage/product/${detail.image}`}
                                                                                            className="img-fluid" alt="Phone" />
                                                                                        <div className='text-center'>
                                                                                            <Link style={{ color: '#eb1834', }} to={`../product-detail/${detail.slug_product}`} className='my-2'>Mua lại</Link>
                                                                                        </div>
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
                                                                                <div className="row">
                                                                                    <div className="col-12">
                                                                                        {
                                                                                            detail.status === 4 ? <>
                                                                                                <RatingForm idProduct={detail.product_id}/>
                                                                                            </> : ""
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p>Không có chi tiết đơn hàng.</p>
                                                                    )}

                                                                </div>
                                                                <div className="d-flex justify-content-between pt-2">
                                                                    <p className="fw-bold mb-0">Chi tiết đơn hàng</p>
                                                                    <p className="text-muted mb-0">
                                                                        <span className="fw-bold me-4">Tổng cộng</span>
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.order.total_amount)}
                                                                    </p>
                                                                </div>
                                                                <div className="d-flex justify-content-between mb-5">
                                                                    <p className="text-muted my-2"><span className="fw-bold me-4">Chi phí vận chuyển</span> Miễn phí</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>Bạn không có đơn hàng nào.</p>
                                                    )}
                                                </div>
                                            </>
                                    }
                                    {/* <div className="col-12">
                                        <Link to="../order_tracking" className="btn btn-success my-3" data-abc="true"> Theo dõi đơn hàng của bạn <i className="fa fa-chevron-right" /></Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default OrderHistory