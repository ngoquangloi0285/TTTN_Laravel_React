import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axios from '../../../api/axios';
import { OrderQRCode } from '../QRCode/OrderQRCode';
import { AiOutlineRollback } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';

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
      <Meta title={`Lịch sử mã đơn hàng: ${id}`} />
      <div className="container-xxl">
        <section className="h-100 gradient-custom your_order">
          <div className="container py-5 h-100">
            {isLoading ? 'Loading...' :
              <div className="row d-flex justify-content-center align-items-center h-100">
                <h1>Lịch sử mã đơn hàng: {id}</h1>
                <div className='col-12'>
                  <div className='card-body edit_your_order px-4 py-0'>
                    <div className='text-center'><h1>Thông tin khách hàng</h1></div>
                    <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                    <div className="d-flex justify-content-around">
                      <div className='mx-2'>
                        <label htmlFor="name">Tên khách hàng:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.orderer_name} />
                      </div>
                      <div className='mx-2'>
                        <label htmlFor="name">Email:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.email_order} />
                      </div>
                      <div className='mx-2'>
                        <label htmlFor="name">Số điện thoại:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.phone_order} />
                      </div>
                      <div className='mx-2'>
                        <label htmlFor="name">Địa chỉ giao hàng:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.address_order} />
                      </div>
                      <div className='mx-2'>
                        <label htmlFor="name">Thành Phố:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.city} />
                      </div>
                      <div className='mx-2'>
                        <label htmlFor="name">Mã bưu điện:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.zip_code} />
                      </div>
                    </div>
                    <div className="my-3">
                      <div className='mx-2'>
                        <label htmlFor="name">Lời nhắn của khách hàng:</label>
                        <textarea type="text" className='form-control text-danger' disabled value={orders.order.note} />
                      </div>
                    </div>
                  </div>
                  <div className='text-center'><h1>QR Code</h1></div>
                  <div className='d-flex justify-content-center'>
                    <OrderQRCode order={orders.order} />
                  </div>
                  <hr className="mt-4" style={{ backgroundColor: '#000', opacity: 1 }} />
                </div>
                <div className="col-lg-12 col-xl-12">
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
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orders.order.total_amount)}
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
                    <h6 className='mt-3'><i>Mã đơn hàng</i>: <strong>{orders.order.id}</strong></h6>
                    
                    <div className="track">
                      <div className={`step ${orders.order.status > 0 ? "active" : ""}`}>
                        <span className="icon">
                                    <i className="fa fa-check" />
                                </span>
                        <span className="text">
                          {orders.order.status === 0 ? "Đang đợi xác nhận đơn hàng..." : "Đã xác nhận đơn hàng"}
                        </span>
                      </div>
                      <div className={`step ${orders.order.status > 1 ? "active" : ""}`} >
                        <span className="icon">
                                    <i className="fa fa-user" />
                                </span>
                        <span className="text">
                          {orders.order.status <= 1 ? "Đang đợi đóng hàng..." : "Đã đóng hàng"}
                        </span>
                      </div>
                      <div className={`step ${orders.order.status > 2 ? "active" : ""}`}>
                        <span className="icon">
                                    <i className="fa fa-truck" />
                                </span>
                        <span className="text">
                          {orders.order.status <= 2 ? "Đang đợi giao đơn cho nhà vận chuyển..." : "Đang vận chuyển"}
                        </span>
                      </div>
                      <div className={`step ${orders.order.status > 3 ? "active" : ""}`}>
                        <span className="icon">
                                    <i className="fa fa-box" />
                                </span>
                        <span className="text">
                          {orders.order.status <= 3 ? "Chưa giao đến..." : "Đã giao"}
                        </span>
                      </div>
                    </div>
                    <br />
                    {isLoading && <div className='d-flex justify-content-center fs-5'>Đang xử lý...</div>}
                    <br />
                    <div className="d-flex justify-content-center align-items-center">
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
            }
          </div>
        </section >
      </div >


    </>
  )
}

export default ViewHistory