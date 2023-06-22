import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { BsFillTrashFill } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { IoCreateOutline } from 'react-icons/io5';
import { FiTrash2 } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineHistory } from 'react-icons/ai';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import Meta from '../../../components/frontend/Meta';
import Swal from 'sweetalert2';

function CellRenderer(props) {
  const { value, endpoint, fieldName } = props;
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get(endpoint + `?id=${value}`)
      .then(response => {
        const res = response.data
        setData(res[fieldName])
      })
      .catch(error => {
        console.log(error);
      });
  }, [value, fieldName, endpoint]);

  return <span>{data}</span>;
}


export default function DataGridDemo() {

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Mã đơn hàng',
        align: 'center',
      },

      {
        field: 'orderer_name',
        headerName: 'Tên khách hàng',
        editable: true,
        width: 150,
        align: 'center',
      },
      {
        field: 'email_order',
        headerName: 'eMail khách hàng',
        editable: true,
        width: 200,
        // align: 'center',
      },
      {
        field: 'total_amount',
        headerName: 'Tổng tiền đơn hàng',
        editable: true,
        width: 150,
        align: 'center',
        valueFormatter: (params) => {
          const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          });
          return formatter.format(params.value);
        }
      },
      {
        field: 'note',
        headerName: 'Lời nhắn khách hàng',
        editable: true,
        width: 250,
        align: 'center',
      },
      {
        field: 'payment_method',
        headerName: 'Phương thức thanh toán',
        editable: true,
        width: 200,
        align: 'center',
      },
      // {
      //   field: 'note_admin',
      //   headerName: 'Ghi chú',
      //   editable: true,
      //   width: 250,
      //   align: 'center',
      // },
      {
        field: 'status',
        headerName: 'Trạng thái đơn hàng',
        width: 220,
        align: 'center',
        renderCell: (params) => {
          const statusStyle = {
            padding: '5px',
            borderRadius: '5px',
            color: 'black',
          };
          let statusText, backgroundColor;
          switch (params.value) {
            case 0:
              statusText = 'Đang đợi xác nhận...';
              backgroundColor = 'yellow';
              break;
            case 1:
              statusText = 'Đang đợi đóng gói...';
              backgroundColor = 'green';
              break;
            case 2:
              statusText = 'Đang đợi vận chuyển...';
              backgroundColor = 'pink';
              break;
            case 3:
              statusText = 'Đang giao...';
              backgroundColor = 'orange';
              break;
            case 4:
              statusText = 'Đã giao';
              backgroundColor = 'purple';
              break;
            default:
              statusText = 'Không xác định';
              backgroundColor = 'gray';
          }
          const statusDivStyle = {
            ...statusStyle,
            backgroundColor,
          };
          return <div style={statusDivStyle}>{statusText}</div>;
        },
        editable: true,
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        sortable: false,
        align: 'center',
        renderCell: (params) => (
          <>
            <Link
              className='mx-1 text-info'
              style={{ fontSize: '25px', cursor: 'pointer' }}
              title='Edit'
              to={`view-update/${params.id}`}
            >
              <AiOutlineEye />
            </Link>
          </>
        ),
      },
    ]
  )

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countTrash, setCountTrash] = useState(0);
  const [filter, setFilter] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/order/v1/orders', {
        params: {
          filter: filter,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRecords(response.data);
      setInitialData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [filter]);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/order/v1/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateData = async () => {
    try {
      const [productsResponse, trashResponse] = await Promise.all([
        axios.get('/api/product/v1/products'),
        axios.get('/api/product/v1/trash')
      ]);
      setRecords(productsResponse.data);
      setInitialData(productsResponse.data);
      setCountTrash(trashResponse.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = e => {
    const { value } = e.target;
    setRecords(prevRecords => {
      // nếu thanh search không có dữ liệu thì tự động load lại danh sách
      if (value === '') {
        return [...initialData];
      }
      return prevRecords.filter(record =>
        record.id.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const LoadPage = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-loadpage');
    btn.innerHTML = "Loading page...";
    await fetchData();
    btn.innerHTML = "Load page";
  };

  // xóa tạm nhiều sản phẩm
  const [arrDmr, setArrDmr] = useState([])
  const handleDeleteAll = useCallback(async () => {
    try {
      const res = await axios.delete(`/api/product/v1/products/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ ids: arrDmr })
      });
      Swal.fire(
        'Delete Product Successfully',
        res.data.message,
        'success'
      )
      setArrDmr([]);
      updateData();
    } catch (error) {
      console.error(error);
      // toast.error('Failed to delete product.');
      Swal.fire(
        'Delete Product Successfully',
        error.data.message,
        'success'
      )
    }
  }, [arrDmr])
  /// xác nhận xóa tạm
  const confirmDeleteALL = useCallback(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete all this catalog and related products!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteAll();
      }
    });
  }, [handleDeleteAll]);

  useEffect(() => {
    fetchData();
    fetchTrash();
  }, [fetchData]);

  if (isLoading === true) {
    return <>
      <LoadingOverlay className='text-danger'
        spinner
        active={isLoading}
        text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
        }
      ></LoadingOverlay>
    </>
  }
  return (
    <>
      <Meta title={"Order"} />
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Tìm kiếm đơn hàng..."
            onChange={handleFilter}
          />
          <div className="col-3 d-flex">
            <Link to="history-order" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <AiOutlineHistory className='fs-4' /> Lịch sử đơn hàng 
              {/* <span> ( {!countTrash ? "0" : countTrash} )</span> */}
            </Link>
          </div>
          <div className="row">
            <div className="col-5 mt-2">
              <p className='mb-0 title-sort d-block'><i><strong>Chọn đơn hàng theo trạng thái:</strong></i></p>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' name="" id="">

                <option value="" selected>Tất cả trạng thái đơn hàng</option>

                <option value="order_confirmation">Đơn hàng được xác nhận</option>
                <option value="order_waiting_confirmation">Đơn hàng đang đợi xác nhận</option>

                <option value="order_packed">Đơn hàng đã đóng gói</option>
                <option value="order_waiting_packing">Đơn hàng đang đợi đóng gói</option>

                <option value="order_shipping">Đơn hàng đang vận chuyển</option>
                <option value="order_waiting_shipped">Đơn hàng đang đợi vận chuyển</option>

                <option value="order_delivered">Đơn hàng đã được giao</option>

              </select>
            </div>
          </div>
          {/* hiện data product */}
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={records}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(data) => {
                setArrDmr(data)
              }}
              components={{
                Toolbar: GridToolbar,
              }}
              // Hàm này sẽ được gọi mỗi khi thực hiện tìm kiếm
              onFilterModelChange={(model) => console.log(model)}
            />
          </Box>

          {/* hiện data product end*/}

          <div className="col-3 my-3">
            <button type="button" id='btn-loadpage' onClick={LoadPage} className="btn btn-dark">
              Load page
            </button>
          </div>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}