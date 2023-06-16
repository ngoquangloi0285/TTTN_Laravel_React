import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axios from '../../../api/axios';
import { Link } from 'wouter';

const ViewHistory = () => {
  const { id } = useParams(); // lấy ID từ URL
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderData = useCallback(async () => {
    try {
      const orderResponse = await axios.get(`api/order/v1/history_trash/${id}`);
      if (orderResponse.data) {
        setOrders(orderResponse.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderData();
  }, [id, fetchOrderData]);

  return (
    <>
      <div className="container-xxl">
        <section className="h-100 gradient-custom your_order">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-12">
                {
                  isLoading ? 'Loading...' :
                    <div className="card" style={{ borderRadius: 10 }}>
                      {/* <h5 className="text-muted mb-0">Thông tin lịch sử đơn hàng của bạn, <span style={{ color: '#000' }}>{currentUser?.name}</span>!</h5> */}
                      <div className="card-body p-4">
                        <p className='text-success'>Thông báo từ quản trị viên: {orders.order.note_admin}
                        </p>
                        <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}>Biên lai</p>
                          <p className="fs-5 text-muted mb-0"><strong>Phiếu nhận hàng: {orders.order.id}
                          </strong></p>
                        </div>
                        <div className="card shadow-0 border mb-4">
                          {orders.orderDetails.length > 0 ? (
                            orders.orderDetails.map((detail) => (
                              <div className="card-body">
                                <div className="row" key={detail.id}>
                                  <div className="col-md-2">
                                    <img
                                      src={`http://localhost:8000/storage/product/${detail.image}`}
                                      className="img-fluid" alt="Phone" />
                                    <Link className='my-2' to='#'>Mua lại</Link>
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
                            ))
                          ) : (
                            <p>Không có chi tiết đơn hàng.</p>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between pt-2">
                        <p className="fw-bold mb-0">Chi tiết đơn hàng</p>
                        <p className="text-muted mb-0">
                          <span className="fw-bold me-4">Tổng cộng</span>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orders.order.total_amount)}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mb-5">
                        <p className="text-muted my-2"><span className="fw-bold me-4">Chi phí vận chuyển</span> Miễn phí</p>
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </section >
      </div >


    </>
  )
}

export default ViewHistory