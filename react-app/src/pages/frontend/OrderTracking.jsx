import React, { useCallback, useEffect, useState } from 'react'
import Meta from '../../components/frontend/Meta'
import Maps from '../../components/frontend/Maps'
import './your_order.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import useAuthContext from '../../context/AuthContext'
import Swal from 'sweetalert2'

const OrderTracking = () => {

  const { currentUser } = useAuthContext();
  const userID = currentUser?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrderData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/order/v1/your_order/${userID}`);
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

  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  const handleCancleOrder = useCallback(async (id) => {
    try {
        const response = await axios.delete(`/api/order/v1/destroy/${id}`);
        if (response.status === 200) {
            setStatus(response.data.status)
            // toast.success(response.data.status);
            Swal.fire({
                icon: 'warning',
                title: 'Một thư hủy đơn hàng sẽ được gửi đến Email của Bạn!',
                text: response.data.success,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('../order_history')
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
}, [navigate]);

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


  return (
    <>
      <Meta title="Theo dõi đơn hàng" />
      <Maps title="Theo dõi đơn hàng" />

      <div className="container-xxl">
        <article className="card order_tracking">
          <div className="card-body">
            {
              isLoading ?
                <>
                  <div>
                    Loading...
                  </div>
                </>
                :
                <>
                  <div className='card-body p-4'>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.order.id}>
                          <h6 className='mt-3'><i>Mã đơn hàng</i>: <strong>{order.order.id}</strong></h6>
                          {
                            order.order.status < 1 &&
                            <div className="row my-2">
                              <div className="col-12">
                                <button onClick={() => confirmCancleOrder(order.order.id)} className='btn bg-danger text-white'>Hủy đơn hàng</button>
                              </div>
                            </div>
                          }
                          <article className="card">
                            <div className="card-body row">
                              <div className="col-12">
                                <strong>Ước tính thời gian giao hàng: </strong>
                                {
                                  order.order.deliveryTime ? new Date(order.order.deliveryTime).toLocaleDateString('vi-VN') : 'Sẽ cập nhật sau khi xử lý đơn hàng...'
                                }
                              </div>
                              <div className="col-12">
                                <strong>Thông báo từ quản trị viên: </strong>
                                {
                                  order.order.note_admin === null ? 'Không có thông báo nào!' : order.order.note_admin
                                }
                              </div>
                            </div>
                          </article>

                          <div className="track">
                            <div className={`step ${order.order.status > 0 ? "active" : ""}`}>
                              <span className="icon">
                                <i className="fa fa-check" />
                              </span>
                              <span className="text">
                                {order.order.status === 0 ? "Đang đợi xác nhận đơn hàng..." : "Đã xác nhận đơn hàng"}
                              </span>
                            </div>
                            <div className={`step ${order.order.status > 1 ? "active" : ""}`}>
                              <span className="icon">
                                <i className="fa fa-user" />
                              </span>
                              <span className="text">
                                {order.order.status <= 1 ? "Đang đóng hàng..." : "Đã đóng hàng"}
                              </span>
                            </div>
                            <div className={`step ${order.order.status > 2 ? "active" : ""}`}>
                              <span className="icon">
                                <i className="fa fa-truck" />
                              </span>
                              <span className="text">
                                {order.order.status <= 2 ? "Đang đợi giao đơn cho nhà vận chuyển..." : "Đang vận chuyển"}
                              </span>
                            </div>
                            <div className={`step ${order.order.status > 3 ? "active" : ""}`}>
                              <span className="icon">
                                <i className="fa fa-box" />
                              </span>
                              <span className="text">
                                {order.order.status <= 3 ? "Chưa giao đến..." : "Đã giao"}
                              </span>
                            </div>
                          </div>
                          <hr className="mt-4" style={{ backgroundColor: '#000', opacity: 1 }} />
                        </div>
                      ))
                    ) : (
                      <p>Bạn không có đơn hàng nào!</p>
                    )}
                  </div>
                </>
            }
            <hr className="my-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
            <Link to="../your_order" className="btn btn-warning" data-abc="true"> <i className="fa fa-chevron-left" /> Trở về đơn hàng của bạn</Link>
          </div>
        </article>
      </div>
    </>
  )
}

export default OrderTracking