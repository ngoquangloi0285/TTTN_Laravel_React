import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CountUp } from '../../../../node_modules/countup.js/dist/countUp.js';
import '../Revenue/revenue.css';
import axios from '../../../api/axios';
import { BsFillCartCheckFill, BsFillCartXFill } from "react-icons/bs";
import { FaUserCheck } from 'react-icons/fa';
import { FcMoneyTransfer } from 'react-icons/fc';

const RevenueWeb = () => {
  const revenueNumberRef = useRef(null);
  const completedOrdersNumberRef = useRef(null);
  const canceledOrdersNumberRef = useRef(null);
  const countUserRef = useRef(null);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());

  const [revenue, setRevenue] = useState('');
  const [completedOrders, setCompletedOrders] = useState('');
  const [canceledOrders, setCanceledOrders] = useState('');
  const [countUser, setCountUser] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/order/v1/revenue', {
        params: {
          month,
          year,
        },
      });

      const { revenue } = response.data;
      setRevenue(revenue);
    } catch (error) {
      console.error(error);
    }
  }, [month, year]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get('/api/order/v1/completed_orders', {
          params: {
            month,
            year,
          },
        });

        const { completed_orders } = response.data;
        setCompletedOrders(completed_orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/order/v1/canceled_orders', {
          params: {
            month,
            year,
          },
        });

        const { canceled_orders } = response.data;
        setCanceledOrders(canceled_orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const countRegisteredUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/order/v1/count_user', {
          params: {
            month: month,
            year: year,
          },
        });

        const userCount = response.data.user_count;
        console.log('Number of registered users:', userCount);
        setCountUser(userCount)
        // Thực hiện các xử lý khác với số lượng người dùng đã đăng ký theo tháng và năm
      } catch (error) {
        console.error('Error while counting registered users:', error);
        // Xử lý lỗi nếu có
      }
    };

    countRegisteredUsers();
  }, [month, year]);

  useEffect(() => {
    setIsLoading(true);
    if (revenueNumberRef.current) {
      const countUp = new CountUp(revenueNumberRef.current, revenue, {
        duration: 2,
        separator: ',',
        formattingFn: (value) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
      });

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
    if (completedOrdersNumberRef.current) {
      const countUp = new CountUp(completedOrdersNumberRef.current, completedOrders, {
        duration: 2,
        separator: ',',
      });

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
    if (canceledOrdersNumberRef.current) {
      const countUp = new CountUp(canceledOrdersNumberRef.current, canceledOrders, {
        duration: 2,
        separator: ',',
      });

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
    if (countUserRef.current) {
      const countUp = new CountUp(countUserRef.current, countUser, {
        duration: 2,
        separator: ',',
      });

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
    setIsLoading(false);
  }, [revenue, completedOrders, canceledOrders, countUser]);

  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="revenue">
            <h3 className="text-center mt-3">Thống kê doanh thu</h3>
            <div className="revenue-card">
              <div className="revenue-number">
                <p className='mt-3 mb-0 fs-4 ' style={{ fontWeight: '600', color: "#11009E" }}> <i style={{fontSize: '30px', color: '#DA1212'}}><FcMoneyTransfer />
                </i> Doanh thu:</p>
                <div className="fs-1 revenue-element text-white" ref={revenueNumberRef}>
                  <p className="fs-5">
                    {isLoading ? 'Loading...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue)}
                  </p>
                </div>
                <p className='mt-3 mb-0 fs-4 ' style={{ fontWeight: '600', color: "#11009E" }}> <i style={{fontSize: '30px', color: '#DA1212'}}><BsFillCartCheckFill />
                </i> Đơn hoàn thành: </p>
                <div className="fs-1 revenue-element text-white" ref={completedOrdersNumberRef}>
                  <p className="fs-5">
                    {isLoading ? 'Loading...' : completedOrders}
                  </p>
                </div>
                <p className='mt-3 mb-0 fs-4 ' style={{ fontWeight: '600', color: "#11009E" }}> <i style={{fontSize: '30px', color: '#DA1212'}}><BsFillCartXFill />
                </i> Đơn bị hủy:</p>
                <div className="fs-1 revenue-element text-white" ref={canceledOrdersNumberRef}>
                  <p className="fs-5">
                    {isLoading ? 'Loading...' : canceledOrders}
                  </p>
                </div>
                <p className="mt-3 mb-0 fs-4 " style={{ fontWeight: '600', color: "#11009E" }}><i style={{fontSize: '30px', color: '#DA1212'}}><FaUserCheck />
                </i> Khách hàng:</p>
                <div className="fs-1 revenue-element text-white" ref={countUserRef}>
                  <p className="fs-5">
                    {isLoading ? 'Loading...' : countUser}
                  </p>
                </div>
              </div>

              <div className="revenue-select">
                {isLoading ? 'Loading...' : ''}
                <div>
                  <div className="mb-3">
                    <label htmlFor="month" className="form-label">
                      Nhập tháng doanh thu:
                    </label>
                    <input value={month} onChange={handleMonthChange} type="email" className="form-control" id="month" placeholder="9" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="year" className="form-label">
                      Nhập năm doanh thu:
                    </label>
                    <input value={year} onChange={handleYearChange} type="email" className="form-control" id="year" placeholder="2023" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueWeb;

